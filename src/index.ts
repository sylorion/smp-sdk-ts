import { statusByServices } from './api/graphql/queries/index.js';
import { GET_SERVICE_BY_AUTHOR_ID } from "./api/graphql/queries/index.js";
import { SMPAPIClient } from "./api/SMPAPIClient.js"
import { SMPClient } from "./smp/SMPClient.js"
export { SMPClient, SMPAPIClient, GET_SERVICE_BY_AUTHOR_ID, statusByServices } ;


// SMP_API_URL=https://api.smp.ceo
// SMP_GRAPHQL_URL = https://graphql.smp.ceo
// SMP_DEFAULT_LANGUAGE = en
const appId = "your-app-id";
const appSecret = "your-app-secret";
const username = "user";
const password = "password";

(async () => {
  const smpClient = new SMPClient(appId, appSecret);
  // await smpClient.authenticateApp();

  // // Authenticate the user
  // await smpClient.authenticateUser(username, password);

  // const apiClient = smpClient.httpClient;
  // const posts = await apiClient.query(GET_SERVICE_BY_AUTHOR_ID, { userId: "user-id" });

  // console.log("Posts:", posts);
})();