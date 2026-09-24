const FIELDS = `
  organizationID
  settings
  savedSettings
  isDefault
  customizationSuspended
  entitlements { canCustomize canRemovePoweredBy plan }
  warnings
  updatedAt
`;

export const documentSettingsQueries = {
  GET_ORGANIZATION_DOCUMENT_SETTINGS: `
    query OrganizationDocumentSettings($organizationID: ID!) {
      organizationDocumentSettings(organizationID: $organizationID) {${FIELDS}}
    }
  `,
};

export const documentSettingsMutations = {
  UPDATE_ORGANIZATION_DOCUMENT_SETTINGS: `
    mutation UpdateOrganizationDocumentSettings($organizationID: ID!, $settings: JSON!) {
      updateOrganizationDocumentSettings(organizationID: $organizationID, settings: $settings) {${FIELDS}}
    }
  `,
  RESET_ORGANIZATION_DOCUMENT_SETTINGS: `
    mutation ResetOrganizationDocumentSettings($organizationID: ID!) {
      resetOrganizationDocumentSettings(organizationID: $organizationID) {${FIELDS}}
    }
  `,
};
