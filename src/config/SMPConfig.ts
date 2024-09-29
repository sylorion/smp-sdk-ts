import { SupportedLang } from "../i18n";
import { PersistenceKind, PersistenceType } from "./Persistence";

export type SMPConfig = {
  appId                 : string;
  appSecret             : string;
  apiUrl                : string;
  graphqlUrl            : string;
  defaultLanguage       : SupportedLang;
  appAccessDuration     : number; // configurable duration for app token refresh
  userAccessDuration    : number; // configurable duration for user token refresh
  minUserAccessDuration : number; // enforced by backend
  minAppAccessDuration  : number; // enforced by backend
  persistence           : PersistenceKind;
  storage               : PersistenceType;
};
