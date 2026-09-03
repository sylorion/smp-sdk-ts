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
export * from './types/plan/index.js';
export * from './types/review/index.js';
export * from './types/review/format.js';

// ==========================================
// CORE CLASSES & CONFIG
// ==========================================
export * from './domains/index.js';

export { SMPClient, APIClient };
export { Persistence, defaultLanguage, logger };
export type { SMPClientOptions } from './config/SMPConfig.js';
export * from './types/auth/index.js';

// ==========================================
// PRICING — source de vérité du calcul de prix
// ==========================================
// Recopié depuis libs/shared/pricing du monorepo par scripts/sync-pricing.sh.
// Le frontend doit importer `computePricing` / `computeCartPricing` d'ici plutôt
// que de réimplémenter la formule : c'est ce qui garantit que le montant affiché
// et le montant débité coïncident avec ce que facture le backend.
export * from './pricing/pricing.generated.js';
