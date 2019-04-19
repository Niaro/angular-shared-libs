import {
	Directive, ElementRef, Input, HostListener, Renderer2, OnChanges,
	OnInit, AfterViewInit, SimpleChanges
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { skip, filter, map } from 'rxjs/operators';
import { createTextMaskInputElement } from 'text-mask-core/dist/textMaskCore';
import { isFunction, isArray, isEmpty, isEqual, isNil, isNull, findLast, repeat } from 'lodash-es';

import { AsyncVoidSubject } from '../../rxjs';
import { KEY } from '../../utils';
import { TextMaskConfig, NumberMaskConfig, TextMask, TextMaskFn } from './text-mask.config';
import { MaskPipe } from './mask-pipe';
import { NumberMaskPipe } from './number-mask-pipe';
import { TextMaskPipe } from './text-mask-pipe';

const IS_ANDROID = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
const DEFER = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : setTimeout;

@Directive({
	selector: '[bpTextMask]',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: TextMaskDirective,
		multi: true
	}]
})
export class TextMaskDirective implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {

	@Input()
	set bpTextMask(value: TextMask | TextMaskFn | Partial<TextMaskConfig | NumberMaskConfig>) {
		if (isFunction(value) || isArray(value))
			this.config.mask = value;
		else if (value instanceof TextMaskConfig)
			this.config = value;
		else
			this.config.assign(value);
	}
	config = new TextMaskConfig();

	valueChange$: Observable<string | number>;
	get value() { return this.value$.value.value; }

	private value$ = new BehaviorSubject<{ value: string | number, source: ValueSource }>({ value: undefined, source: undefined });
	private activeConfig: TextMaskConfig;

	private get $host(): HTMLElement { return this.host.nativeElement; }
	private $input: HTMLInputElement;

	private get hasValue() { return !isEmpty(this.$input.value) && this.$input.value !== this.activeConfig.placeholder; }
	private get isInputSelectable() { return ['text', 'search', 'url', 'tel', 'password'].includes(this.$input.type); }
	private textMaskInputManager: {
		state: {
			previousConformedValue: string,
			previousOnRejectRawValue: string
		},
		update: (val: string) => void
	};
	private firstMaskCharIndex = -1;
	private lastMaskCharIndex = -1;

	private maskPipe: MaskPipe | NumberMaskPipe;
	private isEmptyPlaceholderOnInit: boolean;
	private viewInit$ = new AsyncVoidSubject();
	private ready$ = new AsyncVoidSubject();

	private onChange: (v: any) => void;
	private onTouched: () => void;
	private prevMaskedValue = '';
	private lastKeyCode: number;

	constructor(
		private host: ElementRef,
		private renderer: Renderer2
	) {
		this.valueChange$ = this.value$
			.pipe(
				skip(1), // initial value
				filter(({ source }) => source === ValueSource.ui),
				map(({ value }) => value)
			);
	}

	async ngOnChanges({ rtTextMask }: SimpleChanges) {
		await this.viewInit$.toPromise();

		this.updateDirectiveState();

		if (this.textMaskInputManager && this.$input.value)
			this.updateInputAndControlOnConfigChange(!rtTextMask.firstChange && !isEqual(rtTextMask.previousValue, rtTextMask.currentValue));

		this.ready$.complete();
	}

	ngOnInit() {
		if (this.$host.tagName === 'INPUT')
			// `textMask` directive is used directly on an input element
			this.$input = this.$host as HTMLInputElement;
		else
			// `textMask` directive is used on an abstracted input element, `ion-input`, `md-input`, etc
			this.$input = this.$host.getElementsByTagName('INPUT')[0] as HTMLInputElement;

		if (!this.$input)
			throw new Error(`rtTextMask hasn't found the input element among descendents of the ${this.$host.constructor.name}`);
	}

	ngAfterViewInit() {
		this.isEmptyPlaceholderOnInit = !this.$input.placeholder;
		this.viewInit$.complete();
	}

	// begin of ControlValueAccessor
	async writeValue(value: string | number) {
		await this.ready$.toPromise();

		if (this.value$.value.value === value)
			return;
		value = isNil(value) ? '' : value.toString();

		if (this.textMaskInputManager) {
			value = this.activeConfig instanceof NumberMaskConfig ? this.formatDecimalValue(value) : value;
			value = this.applyMaskAndConvertToControlValue(value);
			this.setCaretToValidPosition(this.$input.value.length);
			this.tryActivatePlaceholder();
		} else
			this.$input.value = value;

		this.value$.next({ value, source: ValueSource.write });
	}

	registerOnChange(fn: (value: any) => void) {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void) {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean) {
		this.renderer.setProperty(this.$host, 'disabled', isDisabled);
	}
	// end of ControlValueAccessor

	@HostListener('input', ['$event.target.value'])
	protected onInput(userInput: string) {
		let value: string | number = userInput;

		if (this.textMaskInputManager) {
			value = this.applyMaskAndConvertToControlValue(userInput);

			if (!this.hasValue && this.activeConfig.maskOnFocus && document.activeElement === this.$input)
				this.$input.value = this.activeConfig.placeholder;

			if (this.activeConfig instanceof NumberMaskConfig)
				this.tryActivatePlaceholder();

			this.updateCaretPosition();
		}

		this.emitChange(value);
	}

	@HostListener('paste', ['$event'])
	protected onPaste(e: Event) {
		if (!this.textMaskInputManager) return;

		if (isEmpty(this.textMaskInputManager.state.previousConformedValue)) {
			e.preventDefault();
			this.onInput((<ClipboardEvent>e).clipboardData.getData('text/plain'));
		}
	}

	@HostListener('blur')
	protected onBlur() {
		this.onTouched && this.onTouched();

		if (!this.textMaskInputManager) return;

		this.activeConfig instanceof NumberMaskConfig && this.applyMaskAndUpdateInput(this.formatDecimalValue(this.$input.value));
		this.tryActivatePlaceholder();
	}

	@HostListener('focus')
	protected onFocus() {
		if (!this.textMaskInputManager) return;

		if (!this.hasValue && this.activeConfig.maskOnFocus)
			this.$input.value = this.activeConfig.placeholder;
		this.updateCaretPosition();
	}

	@HostListener('mouseup')
	@HostListener('mousedown')
	protected updateCaretPosition() {
		if (!this.textMaskInputManager) return;

		this.setCaretToValidPosition();
		setTimeout(() => this.setCaretToValidPosition());
	}

	@HostListener('keydown', ['$event'])
	protected onKeyDown(e: KeyboardEvent) {
		if (!this.textMaskInputManager) return;

		this.lastKeyCode = e.keyCode;
		if ([KEY.BACKSPACE, KEY.PAGE_UP, KEY.PAGE_DOWN, KEY.END, KEY.HOME, KEY.LEFT, KEY.UP, KEY.RIGHT, KEY.DOWN].includes(e.keyCode))
			setTimeout(() => this.setCaretToValidPosition());
	}

	private emitChange(value: string | number) {
		this.onChange && this.onChange(value);
		this.value$.next({ value, source: ValueSource.ui });
	}

	private updateDirectiveState() {
		if (!this.config.mask && !this.config.prefix && !this.config.suffix && !(this.config instanceof NumberMaskConfig)) {
			this.textMaskInputManager = undefined;

			if (this.activeConfig) {
				if (this.isEmptyPlaceholderOnInit && this.activeConfig.placeholderFromMask)
					this.renderer.setAttribute(this.$input, 'placeholder', '');

				this.$input.value = this.$input.value
					.replace(this.activeConfig.prefixRegExp, '')
					.replace(this.activeConfig.suffixRegExp, '');

				this.activeConfig = undefined;
			}
			return;
		}

		this.activeConfig = this.config instanceof NumberMaskConfig
			? new NumberMaskConfig(this.config)
			: new TextMaskConfig(this.config);

		this.maskPipe = this.activeConfig instanceof NumberMaskConfig
			? new NumberMaskPipe(this.activeConfig)
			: new TextMaskPipe(this.activeConfig);

		this.activeConfig['inputElement'] = this.$input;
		this.activeConfig.placeholder = this.convertMaskToPlaceholder();

		const renderedMask = this.maskPipe.transform('');
		if (isEmpty(renderedMask)) return;

		this.recalculateFirstLastMaskIndexes();

		if (this.isEmptyPlaceholderOnInit && this.activeConfig.placeholderFromMask)
			this.renderer.setAttribute(this.$input, 'placeholder', this.activeConfig.placeholder);

		this.textMaskInputManager = createTextMaskInputElement({
			...this.activeConfig,
			mask: this.maskPipe.transform.bind(this.maskPipe)
		});
	}

	private setCaretToValidPosition(desiredPosition?: number) {
		if (!this.textMaskInputManager || !this.isInputSelectable) return;
		// tslint:disable-next-line:prefer-const
		let { value, selectionStart, selectionEnd } = this.$input;

		let force = false;
		if (!isNil(desiredPosition)) {
			force = true;
			selectionStart = selectionEnd = desiredPosition;
		}

		if (this.config instanceof NumberMaskConfig && selectionStart === 0 && selectionEnd === value.length)
			this.setCaret(0, this.lastMaskCharIndex);
		else if (selectionStart === selectionEnd) {
			if (this.activeConfig.maskOnFocus && value === this.activeConfig.placeholder)
				this.setCaret(this.firstMaskCharIndex);
			else if (this.firstMaskCharIndex > 0 && selectionStart < this.firstMaskCharIndex)
				this.setCaret(this.firstMaskCharIndex);
			else if (this.lastMaskCharIndex >= 0 && selectionStart > this.lastMaskCharIndex)
				this.setCaret(this.lastMaskCharIndex);
			else if (force)
				this.setCaret(selectionStart, selectionEnd);
		} else if (force)
			this.setCaret(selectionStart, selectionEnd);
	}

	private applyMaskAndConvertToControlValue(userInput: string): string | number {
		if (this.isCursorWithinPrefix())
			// userInput it's a prefix minus one char (due to backspace);
			// because of that the textMask lib isn't able to recognize the userInput as prefix
			// and will just concat prefix + userInput, therefore we are resetting userInput
			this.$input.value = userInput = '';

		let maskedValue: string | number = this.applyMaskAndUpdateInput(userInput);

		if (!this.activeConfig.includeMaskInValue)
			maskedValue = this.cleanValueFromMask(maskedValue);

		if (this.activeConfig instanceof NumberMaskConfig) {
			maskedValue = this.formatDecimalValue(maskedValue)
				.replace(this.activeConfig.decimalSeparatorSymbol, '.')
				.replace(this.activeConfig.thousandsSeparatorSymbol, '')
				.replace(/\s/g, '')
				.replace(/\.$/, '');
			if (!this.activeConfig.allowLeadingZeroes)
				maskedValue = maskedValue !== '' || this.activeConfig.emptyIsZero ? +maskedValue : null;
		}

		return maskedValue;
	}

	private applyMaskAndUpdateInput(userInput: string) {
		let handledUserInput = this.tryApplySuffixOrPrefix(userInput);
		const caret = this.$input.selectionStart;
		let caretChange = 0;

		if (this.activeConfig instanceof NumberMaskConfig) {
			// remove digit if removed just space
			const isOnlySeparatorRemoval = handledUserInput.length !== this.prevMaskedValue.length
				// tslint:disable-next-line: max-line-length
				&& handledUserInput.replace(this.activeConfig.integersSeparatorRegExp, '') === this.prevMaskedValue.replace(this.activeConfig.integersSeparatorRegExp, '');

				if (isOnlySeparatorRemoval) {
				if (this.lastKeyCode === KEY.DELETE)
					handledUserInput = handledUserInput.slice(0, caret) + handledUserInput.slice(caret + 1);
				else {
					handledUserInput = handledUserInput.slice(0, caret - 1) + handledUserInput.slice(caret);
					caretChange--;
				}
			}

			// trim zeros
			if (!this.activeConfig.allowLeadingZeroes) {
				const match = this.activeConfig.leadingZeroRegExp.exec(handledUserInput);
				if (match) {
					handledUserInput = handledUserInput.substring(match[1].length);
					caretChange -= match[1].length;
				}
			}

			// add zero if starts with decimal symbol
			if (handledUserInput.startsWith(this.activeConfig.decimalSeparatorSymbol)) {
				handledUserInput = '0' + handledUserInput;
				if (this.prevMaskedValue !== handledUserInput)
					caretChange++;
			}
		}

		this.recalculateFirstLastMaskIndexes(handledUserInput);
		this.textMaskInputManager.update(handledUserInput);
		handledUserInput = this.$input.value; // the lib writes directly to the input element

		caretChange += handledUserInput.length - userInput.length;

		this.setCaret(Math.max(0, caret + caretChange));

		return this.prevMaskedValue = this.$input.value;
	}

	private updateInputAndControlOnConfigChange(emitOnChange: boolean) {
		this.setCaret(0); // reset caret on config change
		const value = this.applyMaskAndConvertToControlValue(this.value$.value.value.toString());
		emitOnChange && this.emitChange(value);
	}

	private tryApplySuffixOrPrefix(input: string) {
		const { prefix, prefixRegExp, suffix, suffixRegExp } = this.activeConfig;

		let output = input;
		if (prefixRegExp && !prefixRegExp.test(input))
			output = prefix + input;
		if (suffixRegExp && !suffixRegExp.test(input))
			output += suffix;

		return output;
	}

	private recalculateFirstLastMaskIndexes(value: string = '') {
		const renderedMask = this.maskPipe.transform(value)
			.filter(char => char !== this.maskPipe.caretTrap); // remove caret traps for proper indexes calculation
		const maskCharPredicate = char => char instanceof RegExp || isNull(char);
		this.firstMaskCharIndex = renderedMask.findIndex(maskCharPredicate);
		this.lastMaskCharIndex = renderedMask.lastIndexOf(findLast(renderedMask, maskCharPredicate))
			+ (isEmpty(this.cleanValueFromMask(value)) && !this.activeConfig.suffix ? 0 : 1);
	}

	private formatDecimalValue(value: string): string {
		if (this.activeConfig instanceof NumberMaskConfig && (<NumberMaskConfig>this.activeConfig).decimalSeparatorRegExp.test(value)) {
			const { decimalMinimumLimit } = (<NumberMaskConfig>this.config);

			let fractionDigits = (<string>RegExp['$\''])
				.split('');

			fractionDigits = fractionDigits
				.filter(v => (<NumberMaskPipe>this.maskPipe).digitRegExp.test(v));

			const fractionPart = this.activeConfig.decimalSeparatorSymbol + fractionDigits.join('');

			if (fractionDigits.every(v => v === '0'))
				return value.replace(fractionPart, '');

			if (fractionDigits.length < decimalMinimumLimit)
				return value.replace(fractionPart, fractionPart + repeat('0', decimalMinimumLimit - fractionDigits.length));
		}
		return value;
	}

	private cleanValueFromMask(value: string = '') {
		return value
			.replace(this.activeConfig.prefixRegExp, '')
			.replace(this.activeConfig.suffixRegExp, '')
			.split('')
			.filter(char => !this.maskPipe.formatChars.includes(char))
			.join('');
	}

	private setCaret(start: number, end = start) {
		if (IS_ANDROID)
			DEFER(() => this.$input.setSelectionRange(start, end, 'none'));
		else
			this.$input.setSelectionRange(start, end, 'none');
	}

	private convertMaskToPlaceholder() {
		const mask = this.maskPipe.transform('');
		if (mask.indexOf(this.activeConfig.placeholderChar) !== -1)
			throw new Error(
				`Placeholder character must not be used as part of the mask. Please specify a character
				that is not present in your mask as your placeholder character.\n\n
				The placeholder character that was received is: ${JSON.stringify(this.activeConfig.placeholderChar)}\n\n
				The mask that was received is: ${JSON.stringify(mask)}`
			);

		let { placeholderChar } = this.activeConfig;
		if (this.activeConfig instanceof NumberMaskConfig && this.activeConfig.placeholderFromMask)
			placeholderChar = '0';

		return mask.map(char => char instanceof RegExp ? placeholderChar : char).join('');
	}

	private tryActivatePlaceholder() {
		if (this.$input.value === this.activeConfig.placeholder
			|| (this.activeConfig instanceof NumberMaskConfig && this.activeConfig.emptyIsZero && +(this.$input.value) === 0))
			this.$input.value = '';
	}

	private isCursorWithinPrefix() {
		return this.isInputSelectable
			&& this.firstMaskCharIndex > 0
			&& this.$input.selectionStart > 1
			&& this.$input.selectionStart < this.firstMaskCharIndex;
	}
}

enum ValueSource {
	ui,
	write
}
