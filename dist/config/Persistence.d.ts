export type PersistenceKind = 'cookie' | 'localStorage' | 'sessionStorage' | 'memory';
export interface PersistenceType {
    set(key: string, value: any): boolean;
    get(key: string): string;
    remove(key: string): boolean;
}
export declare class Persistence implements PersistenceType {
    private persistenceKind;
    /**
     * Private per-instance store used exclusively by MemoryKind.
     * Each Persistence instance has its own isolated Map, preventing
     * cross-session token contamination in SSR/serverless environments.
     */
    private instanceStore;
    static LocalStorageKind: PersistenceKind;
    static CookieKind: PersistenceKind;
    static SessionStorageKind: PersistenceKind;
    static MemoryKind: PersistenceKind;
    constructor(storageKind?: PersistenceKind);
    set(key: string, value: any): boolean;
    get(key: string): any;
    private _get;
    remove(key: string): boolean;
}
