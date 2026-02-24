export type ObjectStatus =
  'offline' |
  'staging' |
  'awaiting' |
  'reviewed' |
  'rejected' |
  'signaled' |
  'online' |
  'archived'

export type LoginResponse = {
  login: LogIn,
}

export type LogIn = {
  accessToken: string,
  refreshToken: string,
  refreshValidityDuration: number,
  accessValidityDuration: number,
  user: UserLoggedIn,
  message: string,
  errors: [MutationError],
}

export type UserLoggedIn = {
  userID: number,
  uniqRef: string,
  slug: string,
  username: string,
  email: string,
  plan: string,
  profileID?: number,
  lastLogin: Date,
  loginDuration: number,
  state: string,
  createdAt?: Date,
  updatedAt: Date,
  twoFactorEnabled: Boolean,
}

export type TokenRefreshResponse = {
  accessToken: string,
  expiresIn: number,
  message: string,
  errors: [MutationError],
}

export type MutationError = {
  message: string,
}

export type LogoutResponse = {
  success: boolean,
  message: string,
}

export type AppLoginResponse = {
  authenticateApp: AppLogIn,
}

export type AppLogIn = {
  accessToken: string,
  refreshToken: string,
  refreshValidityDuration: number,
  accessValidityDuration: number,
  app: AppLoggedIn,
  errors: [MutationError],
}

export type AppLoggedIn = {
  applicationID: string,
  uniqRef: string,
  slug: string,
  authKey?: string,
  authID?: string,
  description?: string,
  name?: string,
  email?: string,
  logo?: string,
  url?: string,
  plan?: string,
  isOfficialApp?: Boolean,
  appConfiguration?: string,
  developerID?: number,
  authorID?: number,
  state: ObjectStatus,
  createdAt: Date,
  updatedAt: Date,
}