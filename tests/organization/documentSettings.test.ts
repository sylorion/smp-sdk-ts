import { OrganizationDomain } from '../../src/domains/organization';
import { DocumentSettingsController } from '../../src/domains/organization/DocumentSettingsController';
import { documentSettingsMutations, documentSettingsQueries } from '../../src/api/graphql/organization/documentSettings';
import { BASIC_DOCUMENT_SETTINGS, presetSettings } from 'accounting-tools/document';

const RESULT = {
  organizationID: 'org1', settings: BASIC_DOCUMENT_SETTINGS, savedSettings: null, isDefault: true,
  customizationSuspended: false, entitlements: { canCustomize: false, canRemovePoweredBy: false, plan: 'standard' },
  warnings: [], updatedAt: null,
};

describe('DocumentSettingsController', () => {
  const client = () => ({
    query: jest.fn().mockResolvedValue({ organizationDocumentSettings: RESULT }),
    mutate: jest.fn(async (doc: string) => (doc.includes('resetOrganization')
      ? { resetOrganizationDocumentSettings: RESULT }
      : { updateOrganizationDocumentSettings: { ...RESULT, isDefault: false } })),
  });

  it('est exposé sur le domaine organisation', () => {
    expect(new OrganizationDomain(client() as any).documentSettings).toBeInstanceOf(DocumentSettingsController);
  });

  it('lit le réglage et les droits de l’organisation', async () => {
    const c = client();
    const r = await new DocumentSettingsController(c as any).get('org1');
    expect(c.query).toHaveBeenCalledWith(documentSettingsQueries.GET_ORGANIZATION_DOCUMENT_SETTINGS, { organizationID: 'org1' });
    expect(r.entitlements.plan).toBe('standard');
    expect(r.settings.logo).toBe('none');
  });

  it('envoie le réglage tel quel au serveur (qui le normalise) et renvoie le réglage appliqué', async () => {
    const c = client();
    const brand = presetSettings('brand');
    const r = await new DocumentSettingsController(c as any).update('org1', brand);
    expect(c.mutate).toHaveBeenCalledWith(documentSettingsMutations.UPDATE_ORGANIZATION_DOCUMENT_SETTINGS, { organizationID: 'org1', settings: brand });
    expect(r.isDefault).toBe(false);
  });

  it('reset et validations d’entrée', async () => {
    const c = client();
    const ctrl = new DocumentSettingsController(c as any);
    await ctrl.reset('org1');
    expect(c.mutate).toHaveBeenCalledWith(documentSettingsMutations.RESET_ORGANIZATION_DOCUMENT_SETTINGS, { organizationID: 'org1' });
    await expect(ctrl.get('')).rejects.toThrow(/organizationID/);
    await expect(ctrl.update('org1', null as any)).rejects.toThrow(/object/);
    await expect(ctrl.update('org1', [] as any)).rejects.toThrow(/object/);
  });

  it('les documents GraphQL demandent exactement les champs du schéma mu-organization', () => {
    for (const doc of [documentSettingsQueries.GET_ORGANIZATION_DOCUMENT_SETTINGS, documentSettingsMutations.UPDATE_ORGANIZATION_DOCUMENT_SETTINGS, documentSettingsMutations.RESET_ORGANIZATION_DOCUMENT_SETTINGS]) {
      expect(doc).toMatch(/entitlements \{ canCustomize canRemovePoweredBy plan \}/);
      expect(doc).toMatch(/customizationSuspended/);
      expect(doc).toMatch(/savedSettings/);
    }
    expect(documentSettingsMutations.UPDATE_ORGANIZATION_DOCUMENT_SETTINGS).toMatch(/\$settings: JSON!/);
  });
});
