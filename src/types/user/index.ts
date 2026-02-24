// ==============================
// AUTH & SIGNUP
// ==============================
export interface CreateUserInput {
    username: string;
    userKind: string;
    twoFactorEnabled?: boolean | null;
    state: string;
    profileID?: string | null;
    plan?: string | null;
    password: string;
    email: string;
    rsaPublicKey?: string;
}

export interface CreateUserResponse {
    userID: string;
    uniqRef: string;
    slug: string;
    username: string;
    email: string;
    plan?: string;
    profileID?: string;
    userKind: string;
    lastLogin?: string;
    twoFactorEnabled?: boolean;
    loginDuration?: number;
    rsaPublicKey?: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface ForgotPasswordInput {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
    success: boolean;
    token?: string;
}

export interface ResetPasswordInput {
    token: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
    success: boolean;
}

// ==============================
// PROFILE
// ==============================
export interface CreateProfileInput {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string; // ISO 8601 format
    gender?: string;
    nationality?: string;
    phoneNumber?: string;
    locationID?: string;
    idCardNumber?: string;
    authorID: string;
    passportNumber?: string;
    socialSecurityNumber?: string;
    state: string;
}

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    phoneNumber?: string;
    locationID?: string;
    idCardNumber?: string;
    passportNumber?: string;
    socialSecurityNumber?: string;
    state?: string;
    profilePictureID?: string;
}

export interface ProfileEntity {
    profileID: string;
    uniqRef: string;
    slug: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    phoneNumber: string;
    locationID: string;
    idCardNumber?: string;
    passportNumber?: string;
    socialSecurityNumber?: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    profilePicture?: {
        url: string;
    };
    profilePictureID?: string;
}

// ==============================
// AFFILIATE
// ==============================
export interface Affiliate {
    affiliateId: string;
    uniqRef?: string;
    slug?: string;
    referrerUserId: string;
    referredUserId?: string;
    referredUser?: {
        userID: string;
        username?: string;
        email?: string;
        profileID?: string;
        loginDuration?: number;
        lastLogin?: string;
    };
    affiliateToken: string;
    email?: string;
    isValidated: boolean;
    validatedAt?: string;
    expiresAt?: string;
    commissionRate?: number;
    metadata?: any;
    state?: any;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface GenerateAffiliateTokenInput {
    referrerUserId: string;
    email?: string;
    expiresAt?: string;
    commissionRate?: number;
    metadata?: any;
}

export interface AffiliateTokenResponse {
    affiliateToken: string;
    expiresAt?: string;
    message: string;
    errors?: any[];
}

export interface AffiliateTokenInfo {
    referrerUserId: string;
    referrerUsername?: string;
    type: string;
    createdAt?: string;
    isValid: boolean;
    message?: string;
}
