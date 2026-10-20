/** Plage d'un jour : `isoDay` 1 = lundi … 7 = dimanche ; une fin avant le début finit le lendemain (nuit). */
export interface BusinessHoursRange {
  isoDay: number;
  start: string;
  end: string;
}

export interface OrganizationBusinessHours {
  organizationID: string;
  /** Faux : jamais réglés (l'agenda garde son horaire par défaut). */
  configured: boolean;
  alwaysOpen: boolean;
  timezone: string | null;
  ranges: BusinessHoursRange[];
  updatedAt: string | null;
}

/** Ni `alwaysOpen` ni plage : les horaires sont retirés. */
export interface UpdateOrganizationBusinessHoursInput {
  organizationID: string;
  alwaysOpen: boolean;
  timezone?: string | null;
  ranges: BusinessHoursRange[];
}
