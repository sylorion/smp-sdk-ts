import { SupportedLang } from './languages.js';
export declare class I18n {
    private lang;
    private messages;
    private langModule;
    constructor(lang?: SupportedLang);
    loadLanguage(lang?: SupportedLang): Promise<void>;
    setLanguage(lang: SupportedLang): Promise<void>;
    t(key: string, params?: Record<string, string | number>): string;
    translate(key: string, params?: Record<string, string | number>): string;
    formatDate(date: Date, format?: 'short' | 'long'): string;
    formatNumber(value: number, style?: 'currency' | 'decimal'): string;
    getCurrentLanguage(): SupportedLang;
}
