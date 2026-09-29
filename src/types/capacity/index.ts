/**
 * Capacité des prestations — types alignés sur le schéma GraphQL de mu-command
 * (module capacity). Référence : smp/docs/architecture/capacite-prestataire.md.
 */

export type CapacityPeriod = 'day' | 'week' | 'month';
export type CapacityReason = 'paused' | 'service_full' | 'period_full' | 'organization_full';

export interface ServiceCapacity {
  serviceId: string;
  organizationId: string;
  enabled: boolean;
  /** Prestations en cours simultanées (1 à 10 000), `null` sans limite. */
  maxActive?: number | null;
  /** Nouvelles commandes par période (1 à 100 000), `null` sans limite. */
  maxPerPeriod?: number | null;
  period: CapacityPeriod | string;
  pausedUntil?: string | null;
  activeCount: number;
  periodCount: number;
  available: boolean;
  reason?: CapacityReason | string | null;
  /** Fin de la pause ou début de la période suivante ; `null` pour une limite de prestations en cours. */
  nextAvailableAt?: string | null;
  updatedAt?: string | null;
}

export interface OrganizationCapacity {
  organizationId: string;
  enabled: boolean;
  maxActive?: number | null;
  activeCount: number;
  available: boolean;
  updatedAt?: string | null;
}

/** Disponibilité publique : aucune donnée de volume. */
export interface ServiceAvailability {
  serviceId: string;
  available: boolean;
  reason?: CapacityReason | string | null;
  nextAvailableAt?: string | null;
}

/** Champ omis : valeur conservée ; `null` : limite retirée. */
export interface ServiceCapacityInput {
  enabled: boolean;
  maxActive?: number | null;
  maxPerPeriod?: number | null;
  period?: CapacityPeriod | null;
  pausedUntil?: string | null;
}

export interface OrganizationCapacityInput {
  enabled: boolean;
  maxActive?: number | null;
}

export type CapacityErrorCode = 'SERVICE_CAPACITY_REACHED' | 'CAPACITY_INVALID' | 'SELLER_MISMATCH' | 'SERVICE_NOT_FOUND' | 'SERVICE_NOT_IN_ORGANIZATION' | 'BAD_USER_INPUT';
