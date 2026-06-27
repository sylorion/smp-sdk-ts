// ==============================
// ORGANIZATION
// ==============================

// Advanced Attributes (structured JSON stored in Prisma Json? column)
export type OrganizationProfileRole = 'sales' | 'director' | 'manager' | 'contact';

export interface OrganizationProfile {
  role: OrganizationProfileRole;
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrganizationInvitation {
  token: string;
  userID: string | null;
  lastName: string;
  firstName: string;
  expiresAt: string;
  invitedAt?: string;
}

export interface OrganizationMemberProfile {
  jobTitle?: string;
  missionDescription?: string;
  updatedAt?: string;
}

export interface OrganizationAdvancedAttributes {
  profiles?: OrganizationProfile[];
  invitations?: Record<string, OrganizationInvitation>;
  invitationTokens?: Record<string, string>;
  memberProfiles?: Record<string, OrganizationMemberProfile>;
  [key: string]: any;
}

export interface Organization {
    organizationID: string;
    uniqRef: string;
    slug: string;
    authorID: number;
    ownerID?: number;
    orgRef?: string;
    sectorID?: number;
    legalName: string;
    brand?: string;
    sigle?: string;
    smallLogo?: string;
    bigLogo?: string;
    banner?: string;
    smallLogoUrl?: string;
    bigLogoUrl?: string;
    bannerUrl?: string;
    oSize?: string;
    juridicForm?: string;
    juridicCatLabel?: string;
    juridicCatCode?: string;
    currency?: string;
    legalUniqIdentifier?: string;
    vatNumber?: string;
    communityVATNumber?: string;
    capital?: number;
    insuranceRef?: string;
    insuranceName?: string;
    activityStartedAt?: number;
    activityEndedAt?: number;
    description: string;
    summary?: string;
    locationID?: string;
    parentOrganizationID?: string;
    advancedAttributes?: OrganizationAdvancedAttributes;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface CreateOrganizationInput {
    authorID: number;
    ownerID?: number;
    orgRef?: string;
    sectorID?: number;
    legalName: string;
    brand?: string;
    sigle?: string;
    smallLogo?: string;
    bigLogo?: string;
    banner?: string;
    oSize?: string;
    juridicForm?: string;
    juridicCatLabel?: string;
    juridicCatCode?: string;
    currency?: string;
    legalUniqIdentifier?: string;
    vatNumber?: string;
    communityVATNumber?: string;
    capital?: number;
    insuranceRef?: string;
    insuranceName?: string;
    activityStartedAt?: number;
    activityEndedAt?: number;
    description: string;
    summary?: string;
    locationID?: string;
    parentOrganizationID?: string;
    advancedAttributes?: OrganizationAdvancedAttributes;
    state: string;
}

export interface UpdateOrganizationInput {
    ownerID?: number;
    orgRef?: string;
    sectorID?: number;
    legalName?: string;
    brand?: string;
    sigle?: string;
    smallLogo?: string;
    bigLogo?: string;
    banner?: string;
    oSize?: string;
    juridicForm?: string;
    juridicCatLabel?: string;
    juridicCatCode?: string;
    currency?: string;
    legalUniqIdentifier?: string;
    vatNumber?: string;
    communityVATNumber?: string;
    capital?: number;
    insuranceRef?: string;
    insuranceName?: string;
    activityStartedAt?: number;
    activityEndedAt?: number;
    description?: string;
    summary?: string;
    locationID?: string;
    parentOrganizationID?: string;
    advancedAttributes?: OrganizationAdvancedAttributes;
    state?: string;
}

// ==============================
// ORGANIZATION MEDIA
// ==============================
export interface OrganizationMedia {
    organizationMediaID?: string; // from ManageOrganization it is omitted or different, using intersection
    mediaID: string;
    url?: string;
    originalName?: string;
    finalName?: string;
    legend?: string;
    listingPosition?: number;
    state: string;
    media?: {
        mediaID: string;
        url: string;
        originalName: string;
        finalName: string;
    };
}

export interface CreateOrganizationMediaInput {
    mediaID: string;
    organizationID: string;
    legend?: string;
    listingPosition?: number;
    state?: string;
}

export interface UpdateOrganizationMediaInput {
    legend?: string;
    listingPosition?: number;
    state?: string;
}

// ==============================
// ORGANIZATION MEMBERS & ROLES
// ==============================
export interface UserRole {
    roleID: string;
    roleName: string;
}

export interface UserRoleInOrganization {
    roleID: string;
    roleName: string;
}

export interface OrganizationByUser {
    organizationID: string;
    organizationName: string;
    smallLogoUrl: string | null;
    userRole: UserRoleInOrganization;
}

export interface OrganizationsByUserResponse {
    organizationID: string;
    organizationName: string;
    organizationMedia: OrganizationMedia[];
    userRole: UserRole;
}

export interface OrganizationMember {
    userID: string;
    role: string;
    username: string;
    email: string;
    name: string;
    lastname: string;
    joinedAt: string;
    profilePicture?: string;
}

export interface OrganizationMembers {
    members: OrganizationMember[];
    totalMembers: number;
}

export interface CreateUserOrganizationResponse {
    userOrganizationID: string;
    uniqRef: string;
    slug: string;
    authorID: string;
    legend: string;
    userID: string;
    roleID: string;
    organizationID: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface CreateUserOrganizationInput {
    userID: string;
    organizationID: string;
    roleID: string;
}

export interface UpdateUserRoleInOrganizationInput {
    organizationID: string;
    userID: string;
    newRoleID: string;
}

export interface UpdateUserRoleInOrganizationResponse {
    success: boolean;
    message: string;
}

// ==============================
// INVITATIONS & ONBOARDING
// ==============================
export interface InviteUserToOrganizationInput {
    email: string;
    organizationID: string;
    message?: string;
    firstName?: string;
    lastName?: string;
}

export interface AddUserToOrganizationResponse {
    success: boolean;
    message: string;
    token?: string;
    email?: string;
    organizationID?: string;
    organizationName?: string;
    firstName?: string;
    lastName?: string;
}

export interface VerifyInvitationTokenInput {
    token: string;
}

export interface InvitationResponse {
    success: boolean;
    message: string;
    email: string;
    organizationID: string;
    userExists: boolean;
    userID: string | null;
    firstName?: string;
    lastName?: string;
}

export interface SignupAfterInvitationResponse {
    username: string;
    userID: string;
    email: string;
    deletedAt?: string;
    profileID: string;
    firstName?: string;
    lastName?: string;
    organizationName?: string;
    state: string;
}
