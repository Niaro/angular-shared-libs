import { CashierLanguage, CashierLanguages } from './cashier-languages';

export function cashierLangMapper(v: CashierLanguage | string) {
	return v instanceof CashierLanguage ? v : CashierLanguages.findByIso(v);
}
