// src/i18n/i18n.ts 
import en_US from './locales/en_US.js';
import { logger } from '../utils/Logger.js';
import fr_FR from './locales/fr_FR.js';
import es_ES from './locales/es_ES.js';
import { defaultLanguage } from './languages.js';
const messagesMapping = {
    en_US,
    fr_FR,
    es_ES,
};
export class I18n {
    constructor(lang = defaultLanguage) {
        this.messages = {};
        this.lang = defaultLanguage;
        this.loadLanguage(lang);
    }
    /**
     * Langue prise en charge la plus proche : code exact (`fr_FR`), forme BCP 47
     * (`fr-FR`) ou langue seule (`fr`, `en`) ; sinon la langue par défaut.
     * Avant : un code non reconnu (`en`, `fr`) laissait `messages` vide et
     * `langModule` indéfini — toutes les traductions renvoyaient leur clé et
     * `formatDate` / `formatNumber` levaient une TypeError.
     */
    static resolveLanguage(lang) {
        if (typeof lang !== 'string' || !lang.trim())
            return defaultLanguage;
        const normalized = lang.trim().replace('-', '_');
        const supported = Object.keys(messagesMapping);
        const exact = supported.find((l) => l.toLowerCase() === normalized.toLowerCase());
        if (exact)
            return exact;
        const base = normalized.split('_')[0].toLowerCase();
        return supported.find((l) => l.split('_')[0].toLowerCase() === base) ?? defaultLanguage;
    }
    async loadLanguage(lang = defaultLanguage) {
        const resolved = I18n.resolveLanguage(lang);
        if (resolved !== lang) {
            logger.warn(`Unsupported language: ${String(lang)}. Using ${resolved}.`);
        }
        try {
            const module = messagesMapping[resolved];
            this.langModule = module;
            this.messages = module?.messages || {};
            this.lang = resolved;
        }
        catch (error) {
            logger.error(`Failed to load translations for language: ${String(lang)}`, error);
        }
    }
    async setLanguage(lang) {
        await this.loadLanguage(lang);
    }
    t(key, params = {}) {
        const messageTemplate = this.messages[key] ?? key;
        if (!messageTemplate || messageTemplate == "") {
            logger.warn(`Missing translation for key: ${key} in language: ${this.lang}`);
            return key;
        }
        const formated = messageTemplate.replace(/{(\w+)}/g, (_, match) => params[match]?.toString() || '');
        return formated;
    }
    translate(key, params = {}) {
        return this.t(key, params);
    }
    // Les autres méthodes comme formatDate et formatNumber restent inchangées.
    formatDate(date, format = 'short') {
        const options = this.langModule.dateTimeFormat[format];
        return new Intl.DateTimeFormat(this.intlLocale(), options).format(date);
    }
    formatNumber(value, style = 'decimal') {
        const options = this.langModule.numberFormat[style];
        return new Intl.NumberFormat(this.intlLocale(), options).format(value);
    }
    /** `Intl` attend une balise BCP 47 (`fr-FR`) : `fr_FR` y lève une RangeError. */
    intlLocale() {
        return this.lang.replace('_', '-');
    }
    getCurrentLanguage() {
        return this.lang;
    }
}
