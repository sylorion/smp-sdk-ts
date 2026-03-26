export type PersistenceKind = 'cookie' | 'localStorage' | 'sessionStorage' | 'memory'

export interface PersistenceType {
    set(key: string, value: any): boolean;
    get(key: string): string;
    remove(key: string): boolean;
}

import { logger } from '../utils/Logger';

const GLOBAL_STORAGE_KEY = '__SMP_SDK_MEMORY_STORE__';

const getMemoryStore = (): Record<string, any> => {
    const root = (typeof globalThis !== 'undefined' ? globalThis : (typeof global !== 'undefined' ? global : {})) as any;
    if (!root[GLOBAL_STORAGE_KEY]) {
        root[GLOBAL_STORAGE_KEY] = {};
    }
    return root[GLOBAL_STORAGE_KEY];
};

export class Persistence implements PersistenceType {
    private persistenceKind: PersistenceKind;
    public static LocalStorageKind: PersistenceKind = 'localStorage';
    public static CookieKind: PersistenceKind = 'cookie';
    public static SessionStorageKind: PersistenceKind = 'sessionStorage';
    public static MemoryKind: PersistenceKind = 'memory';

    constructor(storageKind: PersistenceKind = 'localStorage') {
        this.persistenceKind = storageKind;
    }

    set(key: string, value: any) {
        logger.info(`[Persistence] SET key="${key}" (kind="${this.persistenceKind}")`);
        const memoryStore = getMemoryStore();
        if (this.persistenceKind === 'cookie') {
            if (typeof document !== 'undefined') {
                logger.info(`[Persistence] Saving to document.cookie`);
                document.cookie = `${key}=${value}; Secure; HttpOnly;`;
            } else {
                logger.info(`[Persistence] Falling back to global memoryStore for cookie`);
                memoryStore[key] = value;
            }
        } else if (this.persistenceKind === 'localStorage') {
            if (typeof window !== 'undefined' && window.localStorage) {
                logger.info(`[Persistence] Saving to window.localStorage`);
                window.localStorage.setItem(key, JSON.stringify(value));
            } else {
                logger.info(`[Persistence] Falling back to global memoryStore for localStorage`);
                memoryStore[key] = value;
            }
        } else if (this.persistenceKind === 'sessionStorage') {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                logger.info(`[Persistence] Saving to window.sessionStorage`);
                window.sessionStorage.setItem(key, JSON.stringify(value));
            } else {
                logger.info(`[Persistence] Falling back to global memoryStore for sessionStorage`);
                memoryStore[key] = value;
            }
        } else {
            logger.info(`[Persistence] Saving to global memoryStore`);
            memoryStore[key] = value;
        }
        return true;
    }

    get(key: string): any {
        const val = this._get(key);
        logger.info(`[Persistence] GET key="${key}" -> ${val ? '[FOUND]' : '[NOT FOUND]'}`);
        return val;
    }

    private _get(key: string): any {
        const memoryStore = getMemoryStore();
        if (this.persistenceKind === 'cookie') {
            if (typeof document !== 'undefined') {
                const cookies = document.cookie.split('; ');
                const cookie = cookies.find((c) => c.startsWith(key));
                return cookie ? cookie.split('=')[1] : null;
            }
            return memoryStore[key] || null;
        } else if (this.persistenceKind === 'localStorage') {
            if (typeof window !== 'undefined' && window.localStorage) {
                return JSON.parse(window.localStorage.getItem(key) || 'null');
            }
            return memoryStore[key] || null;
        } else if (this.persistenceKind === 'sessionStorage') {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                return JSON.parse(window.sessionStorage.getItem(key) || 'null');
            }
            return memoryStore[key] || null;
        } else {
            return memoryStore[key] || null;
        }
    }

    remove(key: string) {
        const memoryStore = getMemoryStore();
        if (this.persistenceKind === 'cookie') {
            if (typeof document !== 'undefined') {
                document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
            }
        } else if (this.persistenceKind === 'localStorage') {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
            }
        } else if (this.persistenceKind === 'sessionStorage') {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                window.sessionStorage.removeItem(key);
            }
        }
        delete memoryStore[key];
        return true;
    }
}
