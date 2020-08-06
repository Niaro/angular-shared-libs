import { findLast, get, isArray, isEmpty, isEqual, isFunction, isNil, isNull, repeat } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, skip } from 'rxjs/operators';
import { createTextMaskInputElement } from 'text-mask-core/dist/textMaskCore';

import { BACKSPACE, DOWN_ARROW, END, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import {
	AfterViewInit, Directive, ElementRef, HostListener, Input, OnChanges,
	OnInit, Renderer2,
	SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AsyncVoidSubject } from '@bp/shared/rxjs';

import { MaskPipe } from './mask-pipe';
import { NumberMaskPipe } from './number-mask-pipe';
import { TextMaskPipe } from './text-mask-pipe';
import { NumberMaskConfig, TextMask, TextMaskConfig, TextMaskFn } from './text-mask.config';

// tslint:disable-next-line: strict-type-predicates
const IS_ANDROID = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
// tslint:disable-next-line: strict-type-predicates
const DEFER = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : setTimeout;

export type InputTextMaskConfig = TextMask | TextMaskFn | Partial<TextMaskConfig | NumberMaskConfig>;

@Directive({
	selector: '[bpTextMask]',
	providers: [ {
		provide: NG_VALUE_ACCESSOR,
		useExisting: TextMaskDirective,
		multi: true
	} ]
})
export class TextMaskDirective implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {

	@Input()
	set bpTextMask(value: InputTextMaskConfig) {
		if (isFunction(value) || isArray(value))
			this.config.mask = value;
		else if (value instanceof TextMaskConfig)
			this.config = value;
		else
			this.config.assign(value);
	}
	config = new TextMaskConfig();

	valueChange$: Observable<string | number | null>;
	get value() { return this._value$.value.value; }

	private _value$ = new BehaviorSubject<{
		value: string | number | null;
		source: ValueSource | undefined;
	}>
		({ value: null, source: undefined });

	private _activeConfig!: TextMaskConfig | null;

	private get _$host(): HTMLElement { return this._host.nativeElement; }
	private _$input!: HTMLInputElement;

	private get _hasValue() {
		return !isEmpty(this._$input.value)
			&& this._activeConfig
			&& this._$input.value !== this._activeConfig.placeholder;
	}
	private get _isInputSelectable() {
		return [ 'text', 'search', 'url', 'tel', 'password' ].includes(this._$input.type);
	}
	private _textMaskInputManager!: {
		state: {
			previousConformedValue: string;
			previousOnRejectRawValue: string;
		};
		update(val: string): void;
	} | null;
	private _firstMaskCharIndex = -1;
	private _lastMaskCharIndex = -1;

	private _maskPipe!: MaskPipe | NumberMaskPipe;
	private _isEmptyPlaceholderOnInit!: boolean;
	private _viewInit$ = new AsyncVoidSubject();
	private _ready$ = new AsyncVoidSubject();

	private _onChange!: (v: any) => void;
	private _onTouched!: () => void;

	constructor(
		private _host: ElementRef,
		private _renderer: Renderer2
	) {
		this.valueChange$ = this._value$
			.pipe(
				skip(1), // initial value
				filter(({ source }) => source === ValueSource.Ui),
				map(({ value }) => value)
			);
	}

	async ngOnChanges({ rtTextMask }: SimpleChanges) {
		await this._viewInit$.toPromise();

		this._updateDirectiveState();

		if (this._textMaskInputManager && this._$input.value)
			this._updateInputAndControlOnConfigChange(
				!rtTextMask.firstChange && !isEqual(rtTextMask.previousValue, rtTextMask.currentValue)
			);

		this._ready$.complete();
	}

	ngOnInit() {
		// `textMask` directive is used directly on an input element
		this._$input = this._$host.tagName === 'INPUT'
			? <HTMLInputElement> this._$host
			// `textMask` directive is used on an abstracted input element, `ion-input`, `md-input`, etc
			: <HTMLInputElement> this._$host.getElementsByTagName('INPUT')[ 0 ];

		if (!this._$input)
			throw new Error(`rtTextMask hasn't found the input element among descendants of the ${ this._$host.constructor.name }`);
	}

	ngAfterViewInit() {
		this._isEmptyPlaceholderOnInit = !this._$input.placeholder;
		this._viewInit$.complete();
	}

	// begin of ControlValueAccessor
	async writeValue(value?: string | number | null) {
		await this._ready$.toPromise();

		if (this.value === value)
			return;
		value = isNil(value) ? '' : value.toLocaleString();

		if (this._textMaskInputManager) {
			value = this._activeConfig instanceof NumberMaskConfig ? this._formatDecimalValue(value) : value;
			value = this._applyMaskAndConvertToControlValue(value);
			this._setCaretToValidPosition(this._$input.value.length);
			this._tryActivatePlaceholder();
		} else
			this._$input.value = value;

		this._value$.next({ value, source: ValueSource.Write });
	}

	registerOnChange(fn: (value: any) => void) {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void) {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean) {
		this._renderer.setProperty(this._$host, 'disabled', isDisabled);
	}
	// end of ControlValueAccessor

	@HostListener('input', [ '$event.target.value' ])
	onInput(userInput: string) {
		let value: string | number | null = userInput;

		if (this._textMaskInputManager) {
			value = this._applyMaskAndConvertToControlValue(userInput);

			if (!this._hasValue
				&& this._activeConfig
				&& this._activeConfig.maskOnFocus
				&& document.activeElement === this._$input
			)
				this._$input.value = this._activeConfig.placeholder;

			if (this._activeConfig instanceof NumberMaskConfig)
				this._tryActivatePlaceholder();

			this.updateCaretPosition();
		}

		this._emitChange(value);
	}

	@HostListener('paste', [ '$event' ])
	onPaste(e: ClipboardEvent) {
		if (!this._textMaskInputManager) return;

		if (isEmpty(this._textMaskInputManager.state.previousConformedValue)) {
			e.preventDefault();
			e.clipboardData && this.onInput(e.clipboardData.getData('text/plain'));
		}
	}

	@HostListener('blur')
	onBlur() {
		this._onTouched && this._onTouched();

		if (!this._textMaskInputManager) return;

		this._activeConfig instanceof NumberMaskConfig && this._applyMaskAndUpdateInput(
			this._formatDecimalValue(this._$input.value)
		);
		this._tryActivatePlaceholder();
	}

	@HostListener('focus')
	onFocus() {
		if (!this._textMaskInputManager) return;

		if (!this._hasValue && this._activeConfig && this._activeConfig.maskOnFocus)
			this._$input.value = this._activeConfig.placeholder;
		this.updateCaretPosition();
	}

	@HostListener('mouseup')
	@HostListener('mousedown')
	updateCaretPosition() {
		if (!this._textMaskInputManager) return;

		this._setCaretToValidPosition();
		setTimeout(() => this._setCaretToValidPosition());
	}

	@HostListener('keydown', [ '$event' ])
	onKeyDown(e: KeyboardEvent) {
		if (!this._textMaskInputManager) return;

		if ([ BACKSPACE, PAGE_UP, PAGE_DOWN, END, HOME, LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW ]
			// tslint:disable-next-line: deprecation
			.includes(e.keyCode)
		)
			setTimeout(() => this._setCaretToValidPosition());
	}

	private _emitChange(value: string | number | null) {
		this._onChange && this._onChange(value);
		this._value$.next({ value, source: ValueSource.Ui });
	}

	private _updateDirectiveState() {
		if (!this.config.mask && !this.config.prefix && !this.config.suffix && !(this.config instanceof NumberMaskConfig)) {
			this._textMaskInputManager = null;

			if (this._activeConfig) {
				if (this._isEmptyPlaceholderOnInit && this._activeConfig.placeholderFromMask)
					this._renderer.setAttribute(this._$input, 'placeholder', '');

				this._$input.value = this._$input.value
					.replace(this._activeConfig.prefixRegExp || '', '')
					.replace(this._activeConfig.suffixRegExp || '', '');

				this._activeConfig = null;
			}

			return;
		}

		this._activeConfig = this.config instanceof NumberMaskConfig
			? new NumberMaskConfig(this.config)
			: new TextMaskConfig(this.config);

		this._maskPipe = this._activeConfig instanceof NumberMaskConfig
			? new NumberMaskPipe(this._activeConfig)
			: new TextMaskPipe(this._activeConfig);

		this._activeConfig.inputElement = this._$input;
		this._activeConfig.placeholder = this._convertMaskToPlaceholder();

		const renderedMask = this._maskPipe.transform('');
		if (isEmpty(renderedMask)) return;

		this._recalculateFirstLastMaskIndexes();

		if (this._isEmptyPlaceholderOnInit && this._activeConfig.placeholderFromMask)
			this._renderer.setAttribute(this._$input, 'placeholder', this._activeConfig.placeholder);

		this._textMaskInputManager = createTextMaskInputElement({
			...this._activeConfig,
			mask: this._maskPipe.transform.bind(this._maskPipe)
		});
	}

	private _setCaretToValidPosition(desiredPosition?: number) {
		if (!this._textMaskInputManager || !this._isInputSelectable) return;
		// tslint:disable-next-line:prefer-const
		let { value, selectionStart, selectionEnd } = this._$input;
		selectionStart = selectionStart || 0;
		selectionEnd = selectionEnd || 0;

		let force = false;
		if (!isNil(desiredPosition)) {
			force = true;
			selectionStart = selectionEnd = desiredPosition;
		}

		if (this.config instanceof NumberMaskConfig && selectionStart === 0 && selectionEnd === value.length)
			this._setCaret(0, this._lastMaskCharIndex);
		else if (selectionStart === selectionEnd) {
			if (this._activeConfig && this._activeConfig.maskOnFocus && value === this._activeConfig.placeholder)
				this._setCaret(this._firstMaskCharIndex);
			else if (this._firstMaskCharIndex > 0 && selectionStart < this._firstMaskCharIndex)
				this._setCaret(this._firstMaskCharIndex);
			else if (this._lastMaskCharIndex >= 0 && selectionStart > this._lastMaskCharIndex)
				this._setCaret(this._lastMaskCharIndex);
			else if (force)
				this._setCaret(selectionStart, selectionEnd);
		} else if (force)
			this._setCaret(selectionStart, selectionEnd);
	}

	private _applyMaskAndConvertToControlValue(userInput: string): string | number | null {
		if (this._isCursorWithinPrefix())
			// userInput it's a prefix minus one char (due to backspace);
			// because of that the textMask lib isn't able to recognize the userInput as prefix
			// and will just concat prefix + userInput, therefore we are resetting userInput
			this._$input.value = userInput = '';

		let maskedValue = this._applyMaskAndUpdateInput(userInput);

		if (this._activeConfig && !this._activeConfig.includeMaskInValue)
			maskedValue = this._cleanValueFromMask(maskedValue);

		if (this._activeConfig instanceof NumberMaskConfig) {
			maskedValue = this._formatDecimalValue(maskedValue)
				.replace(this._activeConfig.decimalSeparatorSymbol, '.')
				.replace(this._activeConfig.thousandsSeparatorSymbol, '')
				.replace(/\s/g, '')
				.replace(/\.$/, '');

			if (!this._activeConfig.allowLeadingZeroes)
				return maskedValue !== '' || this._activeConfig.emptyIsZero ? +maskedValue : null;
		}

		return maskedValue;
	}

	private _applyMaskAndUpdateInput(userInput: string) {
		if (this._activeConfig instanceof NumberMaskConfig && !this._activeConfig.allowLeadingZeroes) {
			// trim zeros
			const match = this._activeConfig.leadingZeroRegExp.exec(userInput);
			if (match)
				userInput = userInput.substring(match[ 1 ].length);
		}

		this._textMaskInputManager && this._textMaskInputManager.update(userInput);
		this._recalculateFirstLastMaskIndexes(this._$input.value);

		return this._$input.value;
	}

	private _updateInputAndControlOnConfigChange(emitOnChange: boolean) {
		this._setCaret(0); // reset caret on config change
		const value = this._applyMaskAndConvertToControlValue(this.value && this.value.toString() || '');
		emitOnChange && this._emitChange(value);
	}

	private _recalculateFirstLastMaskIndexes(value: string = '') {
		const renderedMask = (this._maskPipe!.transform(value) || [])
			.filter(char => char !== this._maskPipe.caretTrap); // remove caret traps for proper indexes calculation
		const maskCharPredicate = (char: any) => char instanceof RegExp || isNull(char);
		this._firstMaskCharIndex = renderedMask.findIndex(maskCharPredicate);
		this._lastMaskCharIndex = renderedMask.lastIndexOf(findLast(renderedMask, maskCharPredicate)!)
			+ (isEmpty(this._cleanValueFromMask(value)) && !this._activeConfig!.suffix ? 0 : 1);
	}

	private _formatDecimalValue(value: string): string {
		if (this._activeConfig instanceof NumberMaskConfig
			&& (<NumberMaskConfig> this._activeConfig).decimalSeparatorRegExp.test(value)
		) {
			const { decimalMinimumLimit } = (<NumberMaskConfig> this.config);

			let fractionDigits = (<string> get(RegExp, '$\''))
				.split('');

			fractionDigits = fractionDigits
				.filter(v => (<NumberMaskPipe> this._maskPipe).digitRegExp.test(v));

			const fractionPart = this._activeConfig.decimalSeparatorSymbol + fractionDigits.join('');

			if (fractionDigits.every(v => v === '0'))
				return value.replace(fractionPart, '');

			if (fractionDigits.length < decimalMinimumLimit)
				return value.replace(fractionPart, fractionPart + repeat('0', decimalMinimumLimit - fractionDigits.length));
		}

		return value;
	}

	private _cleanValueFromMask(value: string = '') {
		return value
			.replace(this._activeConfig!.prefixRegExp || '', '')
			.replace(this._activeConfig!.suffixRegExp || '', '')
			.split('')
			.filter(char => !this._maskPipe.formatChars.includes(char))
			.join('');
	}

	private _setCaret(start: number, end = start) {
		if (IS_ANDROID)
			DEFER(() => this._$input.setSelectionRange(start, end, 'none'));
		else
			this._$input.setSelectionRange(start, end, 'none');
	}

	private _convertMaskToPlaceholder() {
		const mask = this._maskPipe.transform('');
		if (!mask)
			return '';

		if (mask.indexOf(this._activeConfig!.placeholderChar) !== -1)
			throw new Error(
				`Placeholder character must not be used as part of the mask. Please specify a character
				that is not present in your mask as your placeholder character.\n\n
				The placeholder character that was received is: ${ JSON.stringify(this._activeConfig!.placeholderChar) }\n\n
				The mask that was received is: ${ JSON.stringify(mask) }`
			);

		let { placeholderChar } = this._activeConfig!;
		if (this._activeConfig instanceof NumberMaskConfig && this._activeConfig.placeholderFromMask)
			placeholderChar = '0';

		return mask
			.map(char => char instanceof RegExp
				? placeholderChar
				: char
			)
			.join('');
	}

	private _tryActivatePlaceholder() {
		if ((this._activeConfig && this._$input.value === this._activeConfig.placeholder)
			|| (this._activeConfig instanceof NumberMaskConfig
				&& this._activeConfig.emptyIsZero
				&& +(this._$input.value) === 0
			)
		)
			this._$input.value = '';
	}

	private _isCursorWithinPrefix() {
		return this._isInputSelectable
			&& this._firstMaskCharIndex > 0
			&& this._$input.selectionStart! > 1
			&& this._$input.selectionStart! < this._firstMaskCharIndex;
	}
}

enum ValueSource {
	Ui,
	Write
}
