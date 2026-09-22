/**
 * Logger du SDK.
 *
 * L'implémentation précédente était un simple relais vers `console` :
 *
 *     const logger = { info: (...a) => { console.log(a); }, ... };
 *
 * Tout appel `logger.info` du SDK écrivait donc directement dans la console du
 * navigateur de l'utilisateur final — y compris le corps complet des réponses
 * GraphQL et REST (`APIClient.post` / `APIClient.get`), qui contient tokens,
 * factures, devis et données personnelles.
 *
 * Cette version :
 *  - reste silencieuse en production (aucune sortie hors `error`) ;
 *  - masque les valeurs sensibles avant écriture, y compris en développement ;
 *  - reste activable explicitement via `setLogLevel` pour le débogage local.
 */
export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';
/** Change le niveau de journalisation du SDK (débogage local). */
export declare function setLogLevel(level: LogLevel): void;
export declare function getLogLevel(): LogLevel;
/**
 * Remplace récursivement les valeurs des clés sensibles par un marqueur.
 * Les chaînes longues sont tronquées : une réponse API complète n'a rien à faire
 * dans une console, même en développement.
 */
export declare function redact(value: unknown, depth?: number): unknown;
declare const logger: {
    debug: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
};
export { logger };
