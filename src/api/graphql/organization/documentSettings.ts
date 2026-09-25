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
  /** Public : ce qui est imprimé sur les documents de l'organisation. */
  GET_ORGANIZATION_DOCUMENT_PRESENTATION: `
    query OrganizationDocumentPresentation($organizationID: ID!) {
      organizationDocumentPresentation(organizationID: $organizationID) { organizationID settings logoUrl }
    }
  `,
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
