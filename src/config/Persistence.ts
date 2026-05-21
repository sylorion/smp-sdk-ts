export type PersistenceKind = 'cookie' | 'localStorage' | 'sessionStorage' | 'memory'

export interface PersistenceType {
    set(key: string, value: any): boolean;
    get(key: string): string;
    remove(key: string): boolean;
}

import { logger } from '../utils/Logger';

const GLOBAL_STORAGE_KEY = '__SMP_SDK_MEMORY_STORE__';

/**
 * Global fallback store used ONLY by non-memory kinds (localStorage/cookie/session)
 * when running on the server (no window/document). MemoryKind no longer uses this
 * so isolated clients don't contaminate each other through globalThis.
 */
const getGlobalFallbackStore = (): Record<string, any> => {
    const root = (typeof globalThis !== 'undefined' ? globalThis : (typeof global !== 'undefined' ? global : {})) as any;
    if (!root[GLOBAL_STORAGE_KEY]) {
        root[GLOBAL_STORAGE_KEY] = {};
    }
    return root[GLOBAL_STORAGE_KEY];
};

export class Persistence implements PersistenceType {
    private persistenceKind: PersistenceKind;
    /**
     * Private per-instance store used exclusively by MemoryKind.
     * Each Persistence instance has its own isolated Map, preventing
     * cross-session token contamination in SSR/serverless environments.
     */
    private instanceStore: Map<string, any> = new Map();

    public static LocalStorageKind: PersistenceKind = 'localStorage';
    public static CookieKind: PersistenceKind = 'cookie';
    public static SessionStorageKind: PersistenceKind = 'sessionStorage';
    public static MemoryKind: PersistenceKind = 'memory';

    constructor(storageKind: PersistenceKind = 'localStorage') {
        this.persistenceKind = storageKind;
    }

    set(key: string, value: any) {
        // MemoryKind: always use the private per-instance store
        if (this.persistenceKind === 'memory') {
            this.instanceStore.set(key, value);
            return true;
        }

        const fallbackStore = getGlobalFallbackStore();

        if (this.persistenceKind === 'cookie') {
            if (typeof document !== 'undefined') {
                document.cookie = `${key}=${value}; Secure; HttpOnly;`;
            } else {
                fallbackStore[key] = value;
            }
        } else if (this.persistenceKind === 'localStorage') {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, JSON.stringify(value));
            } else {
                fallbackStore[key] = value;
            }
        } else if (this.persistenceKind === 'sessionStorage') {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                window.sessionStorage.setItem(key, JSON.stringify(value));
            } else {
                fallbackStore[key] = value;
            }
        }
        return true;
    }

    get(key: string): any {
        return this._get(key);
    }

    private _get(key: string): any {
        // MemoryKind: always use the private per-instance store
        if (this.persistenceKind === 'memory') {
            return this.instanceStore.get(key) ?? null;
        }

        const fallbackStore = getGlobalFallbackStore();

        if (this.persistenceKind === 'cookie') {
            if (typeof document !== 'undefined') {
                const cookies = document.cookie.split('; ');
                const cookie = cookies.find((c) => c.startsWith(key));
                return cookie ? cookie.split('=')[1] : null;
            }
            return fallbackStore[key] ?? null;
        } else if (this.persistenceKind === 'localStorage') {
            if (typeof window !== 'undefined' && window.localStorage) {
                return JSON.parse(window.localStorage.getItem(key) || 'null');
            }
            return fallbackStore[key] ?? null;
        } else if (this.persistenceKind === 'sessionStorage') {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                return JSON.parse(window.sessionStorage.getItem(key) || 'null');
            }
            return fallbackStore[key] ?? null;
        }
        return null;
    }

    remove(key: string) {
        // MemoryKind: always use the private per-instance store
        if (this.persistenceKind === 'memory') {
            this.instanceStore.delete(key);
            return true;
        }

        const fallbackStore = getGlobalFallbackStore();

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
        delete fallbackStore[key];
        return true;
    }
}
