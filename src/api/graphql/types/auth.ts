type ObjectStatus = 
  'offline' |
  'staging' |
  'awaiting' | 
  'reviewed' | 
  'rejected' | 
  'signaled' | 
  'online' | 
  'archived'

type LoginResponse = {
  user      : UserLogin,
  message   : string,
  errors    : [MutationError],
}

type UserLogin = {
  accessToken   : string,
  refreshToken  : string,
  details       : UserDetails,
  accessValidityDuration: number,
}
type UserDetails = {
  userID        : number,
  uniqRef       : string,
  slug          : string,
  username      : string,
  email         : string,
  plan          : string,
  profileID?    : number,
  lastLogin     : Date,
  loginDuration : number,
  state         : string,
  createdAt?     : Date,
  updatedAt     : Date,
  twoFactorEnabled: Boolean,
}

type TokenRefreshResponse = {
  accessToken: string,
  expiresIn: number,
  message: string,
  errors: [MutationError],
}

type MutationError = {
  message : string,
}

type LogoutResponse = {
  success: boolean,
  message: string,
}

