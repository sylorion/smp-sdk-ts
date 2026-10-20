import { APIClient } from '../../api/APIClient.js';
export interface OrganizationContact {
    contactID: string;
    uniqRef: string;
    slug: string;
    authorID: string;
    organizationID: string;
    userID?: string | null;
    assignedToUserOrgID?: string | null;
    /** Utilisateur responsable du contact (lead), déduit de `assignedToUserOrgID`. */
    assigneeUserID?: string | null;
    isPrivate: boolean;
    ownerUserOrgID?: string | null;
    contactType: 'individual' | 'company';
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    companyName?: string | null;
    siret?: string | null;
    vatNumber?: string | null;
    legalForm?: string | null;
    rcs?: string | null;
    capital?: string | null;
    logoUrl?: string | null;
    email?: string | null;
    phoneCountryCode?: string | null;
    phone?: string | null;
    mobilePhone?: string | null;
    fax?: string | null;
    website?: string | null;
    locationID?: string | null;
    location?: {
        placeID: string;
    } | null;
    socialProfiles?: Record<string, string> | null;
    contactStatus: 'active' | 'inactive' | 'prospect' | 'lead' | 'churned' | 'blocked';
    source: 'manual' | 'import' | 'invoice' | 'estimate' | 'engagement' | 'form';
    tags?: string[] | null;
    notes?: string | null;
    preferredLanguage?: string | null;
    preferredCurrency?: string | null;
    isVatExempt?: boolean | null;
    defaultPaymentTerms?: number | null;
    creditLimit?: number | null;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}
export interface CreateContactInput {
    organizationID: string;
    contactType?: 'individual' | 'company';
    firstName?: string;
    lastName?: string;
    displayName?: string;
    companyName?: string;
    siret?: string;
    vatNumber?: string;
    legalForm?: string;
    rcs?: string;
    capital?: string;
    logoUrl?: string;
    email?: string;
    phoneCountryCode?: string;
    phone?: string;
    mobilePhone?: string;
    fax?: string;
    website?: string;
    locationID?: string;
    socialProfiles?: Record<string, string>;
    contactStatus?: string;
    source?: string;
    tags?: string[];
    notes?: string;
    preferredLanguage?: string;
    preferredCurrency?: string;
    isVatExempt?: boolean;
    defaultPaymentTerms?: number;
    creditLimit?: number;
    isPrivate?: boolean;
    assignedToUserOrgID?: string;
    userID?: string;
}
export interface UpdateContactInput {
    contactType?: 'individual' | 'company';
    firstName?: string;
    lastName?: string;
    displayName?: string;
    companyName?: string;
    siret?: string;
    vatNumber?: string;
    legalForm?: string;
    rcs?: string;
    capital?: string;
    logoUrl?: string;
    email?: string;
    phoneCountryCode?: string;
    phone?: string;
    mobilePhone?: string;
    fax?: string;
    website?: string;
    locationID?: string;
    socialProfiles?: Record<string, string>;
    contactStatus?: string;
    source?: string;
    tags?: string[];
    notes?: string;
    preferredLanguage?: string;
    preferredCurrency?: string;
    isVatExempt?: boolean;
    defaultPaymentTerms?: number;
    creditLimit?: number;
    isPrivate?: boolean;
    assignedToUserOrgID?: string;
    userID?: string;
    state?: string;
}
export interface BulkContactInput {
    contactType?: 'individual' | 'company';
    firstName?: string;
    lastName?: string;
    displayName?: string;
    companyName?: string;
    siret?: string;
    vatNumber?: string;
    email?: string;
    phoneCountryCode?: string;
    phone?: string;
    mobilePhone?: string;
    website?: string;
    socialProfiles?: Record<string, string>;
    contactStatus?: string;
    notes?: string;
}
/** Filtres d'une liste ; `assignee` : `me`, `unassigned` ou l'identifiant d'un membre. */
export interface ContactListFilters {
    search?: string;
    status?: string;
    source?: string;
    page?: number;
    pageSize?: number;
    assignee?: 'me' | 'unassigned' | string;
}
/** Décompte des contacts visibles par statut. */
export interface OrganizationContactsSummary {
    total: number;
    byStatus: Array<{
        status: string;
        count: number;
    }>;
}
/** Une seule modification à la fois : statut, responsable (ou aucun), ou archivage. 500 contacts au plus. */
export interface BulkUpdateContactsInput {
    organizationID: string;
    contactIDs: string[];
    contactStatus?: string;
    assigneeUserID?: string;
    unassign?: boolean;
    archive?: boolean;
}
export interface HandOverContactInput {
    contactID: string;
    /** Collègue qui reprend le lead (membre de l'organisation, différent de l'appelant). */
    toUserID: string;
    message?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    /** ISO 8601. */
    dueAt?: string;
}
/**
 * Note : depuis le CRM (mu-organization), l'appelant est TOUJOURS l'identité signée du client
 * (`APIClient.withUserAssertion` côté serveur) ; le paramètre `callerUserID` des méthodes est
 * conservé pour compatibilité mais ignoré par le service.
 */
export declare class ContactController {
    private client;
    constructor(client: APIClient);
    list(organizationID: string, callerUserID: string, filters?: ContactListFilters): Promise<OrganizationContact[]>;
    getById(contactID: string, callerUserID: string): Promise<OrganizationContact>;
    search(organizationID: string, callerUserID: string, query: string, limit?: number): Promise<OrganizationContact[]>;
    create(input: CreateContactInput & {
        callerUserID: string;
    }): Promise<OrganizationContact>;
    update(contactID: string, callerUserID: string, input: UpdateContactInput): Promise<OrganizationContact>;
    delete(contactID: string, callerUserID: string): Promise<boolean>;
    bulkCreate(organizationID: string, callerUserID: string, contacts: BulkContactInput[]): Promise<{
        success: boolean;
        created: number;
        skipped?: number;
        message?: string;
    }>;
    setPrivacy(contactID: string, callerUserID: string, isPrivate: boolean): Promise<OrganizationContact>;
    /** `assigneeUserID` null : le contact n'a plus de responsable. */
    assign(contactID: string, assigneeUserID: string | null): Promise<OrganizationContact>;
    handOver(input: HandOverContactInput): Promise<OrganizationContact>;
    summary(organizationID: string): Promise<OrganizationContactsSummary>;
    /** Contacts modifiés et contacts refusés (droits). */
    bulkUpdate(input: BulkUpdateContactsInput): Promise<{
        updated: number;
        refused: number;
    }>;
}
