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

const LEVEL_ORDER: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

/** Clés dont la valeur ne doit jamais apparaître dans une sortie console. */
const SENSITIVE_KEY = /(token|secret|password|passwd|authorization|cookie|session|apikey|api_key|client_secret|iban|cvc|card|jwt|bearer|credential|signature)/i;

const REDACTED = '[masqué]';

function detectDefaultLevel(): LogLevel {
  try {
    const env =
      (typeof process !== 'undefined' && process.env && (process.env.NODE_ENV || process.env.ENV)) || '';
    if (env === 'development' || env === 'dev' || env === 'test') return 'warn';
  } catch {
    /* environnement sans `process` (navigateur) : on reste silencieux */
  }
  return 'error';
}

let currentLevel: LogLevel = detectDefaultLevel();

/** Change le niveau de journalisation du SDK (débogage local). */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

export function getLogLevel(): LogLevel {
  return currentLevel;
}

/**
 * Remplace récursivement les valeurs des clés sensibles par un marqueur.
 * Les chaînes longues sont tronquées : une réponse API complète n'a rien à faire
 * dans une console, même en développement.
 */
export function redact(value: unknown, depth = 0): unknown {
  if (depth > 4) return '[…]';
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    return value.length > 200 ? `${value.slice(0, 200)}… (${value.length} caractères)` : value;
  }
  if (typeof value !== 'object') return value;

  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((v) => redact(v, depth + 1));
  }

  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    out[key] = SENSITIVE_KEY.test(key) ? REDACTED : redact(val, depth + 1);
  }
  return out;
}

function emit(level: Exclude<LogLevel, 'silent'>, args: unknown[]): void {
  if (LEVEL_ORDER[currentLevel] < LEVEL_ORDER[level]) return;
  const safe = args.map((a) => redact(a));
  // eslint-disable-next-line no-console
  const sink = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  sink('[SMP SDK]', ...safe);
}

const logger = {
  debug: (...args: unknown[]) => emit('debug', args),
  info: (...args: unknown[]) => emit('info', args),
  warn: (...args: unknown[]) => emit('warn', args),
  error: (...args: unknown[]) => emit('error', args),
};

export { logger };
