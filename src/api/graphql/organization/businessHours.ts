/** Horaires d'ouverture de l'organisation (mu-organization, `advancedAttributes.businessHours`). */
const FIELDS = `
  organizationID
  configured
  alwaysOpen
  timezone
  ranges { isoDay start end }
  updatedAt
`;

export const businessHoursQueries = {
  GET_ORGANIZATION_BUSINESS_HOURS: `query OrganizationBusinessHours($organizationID: ID!) { organizationBusinessHours(organizationID: $organizationID) { ${FIELDS} } }`,
};

export const businessHoursMutations = {
  UPDATE_ORGANIZATION_BUSINESS_HOURS: `mutation UpdateOrganizationBusinessHours($input: UpdateOrganizationBusinessHoursInput!) { updateOrganizationBusinessHours(input: $input) { ${FIELDS} } }`,
};
