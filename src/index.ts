// Ex-queries import removed:  statusByServices 
// Ex-queries import removed:  serviceQueries 
import { logger } from './utils/Logger.js';
import { APIClient } from './api/APIClient.js'
import { SMPClient } from './SMPClient.js'
import { Persistence } from './config/Persistence.js';
import { defaultLanguage } from './i18n/languages.js';

// ==========================================
// BUSINESS DOMAIN TYPES
// ==========================================
export * from './types/common/index.js';
export * from './types/catalog/index.js';
export * from './types/accounting/index.js';
export * from './types/organization/index.js';
export * from './types/user/index.js';
export * from './types/communication/index.js';
export * from './types/booking/index.js';

// ==========================================
// CORE CLASSES & CONFIG
// ==========================================
export * from './domains/index.js';

export { SMPClient, APIClient };
export { Persistence, defaultLanguage, logger };
export type { SMPClientOptions } from './config/SMPConfig.js';
export * from './types/auth/index.js';
