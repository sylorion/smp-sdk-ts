import { APIClient } from '../../api/APIClient.js';
import { documentSettingsMutations, documentSettingsQueries } from '../../api/graphql/organization/documentSettings.js';
import type { DocumentTemplateSettings, OrganizationDocumentSettings } from '../../types/organization/documentSettings.js';

/**
 * Personnalisation des factures, avoirs, devis et bons de commande d'une organisation.
 *
 * Lecture : tout membre. Écriture : propriétaire, administrateur, responsable financier.
 * Un droit manquant (personnalisation : Starter ; retrait de « Émis avec Services » : Pro)
 * est refusé par le serveur avec le code PLAN_FEATURE_NOT_INCLUDED et `upgradeToTier`.
 */
export class DocumentSettingsController {
  constructor(private readonly client: APIClient) {}

  async get(organizationID: string): Promise<OrganizationDocumentSettings> {
    if (!organizationID) throw new Error('organizationID is required');
    const res = await this.client.query(documentSettingsQueries.GET_ORGANIZATION_DOCUMENT_SETTINGS, { organizationID }) as {
      organizationDocumentSettings: OrganizationDocumentSettings;
    };
    return res.organizationDocumentSettings;
  }

  /** Enregistre le réglage ; le serveur le normalise et renvoie le réglage appliqué. */
  async update(organizationID: string, settings: Partial<DocumentTemplateSettings>): Promise<OrganizationDocumentSettings> {
    if (!organizationID) throw new Error('organizationID is required');
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new Error('settings must be an object');
    const res = await this.client.mutate(documentSettingsMutations.UPDATE_ORGANIZATION_DOCUMENT_SETTINGS, { organizationID, settings }) as {
      updateOrganizationDocumentSettings: OrganizationDocumentSettings;
    };
    return res.updateOrganizationDocumentSettings;
  }

  /** Revient au modèle par défaut. */
  async reset(organizationID: string): Promise<OrganizationDocumentSettings> {
    if (!organizationID) throw new Error('organizationID is required');
    const res = await this.client.mutate(documentSettingsMutations.RESET_ORGANIZATION_DOCUMENT_SETTINGS, { organizationID }) as {
      resetOrganizationDocumentSettings: OrganizationDocumentSettings;
    };
    return res.resetOrganizationDocumentSettings;
  }
}
