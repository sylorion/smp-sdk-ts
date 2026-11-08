import { SupportedLang } from './languages.js';
export declare class I18n {
    private lang;
    private messages;
    private langModule;
    constructor(lang?: SupportedLang);
    /**
     * Langue prise en charge la plus proche : code exact (`fr_FR`), forme BCP 47
     * (`fr-FR`) ou langue seule (`fr`, `en`) ; sinon la langue par défaut.
     * Avant : un code non reconnu (`en`, `fr`) laissait `messages` vide et
     * `langModule` indéfini — toutes les traductions renvoyaient leur clé et
     * `formatDate` / `formatNumber` levaient une TypeError.
     */
    static resolveLanguage(lang: unknown): SupportedLang;
    loadLanguage(lang?: SupportedLang): Promise<void>;
    setLanguage(lang: SupportedLang): Promise<void>;
    t(key: string, params?: Record<string, string | number>): string;
    translate(key: string, params?: Record<string, string | number>): string;
    formatDate(date: Date, format?: 'short' | 'long'): string;
    formatNumber(value: number, style?: 'currency' | 'decimal'): string;
    /** `Intl` attend une balise BCP 47 (`fr-FR`) : `fr_FR` y lève une RangeError. */
    private intlLocale;
    getCurrentLanguage(): SupportedLang;
}
