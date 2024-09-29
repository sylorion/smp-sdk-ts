import { statusByServices } from './api/graphql/queries/index.js';
import { GET_SERVICE_BY_AUTHOR_ID } from "./api/graphql/queries/index.js";
import { APIClient } from "./api/APIClient.js"
import { SMPClient } from "./smp/SMPClient.js"
export { SMPClient, APIClient, GET_SERVICE_BY_AUTHOR_ID, statusByServices } ;


const SMP_API_URL="https://dev.api.services.ceo";
const SMP_GRAPHQL_URL = "https://dev.api.services.ceo/graphql";
const SMP_DEFAULT_LANGUAGE = "US-en";
const appId = "f2655ffda8594852";
const appSecret = "TA7Vin/JY0YIp9sGpiy6d7ade351Ub+Ia3Pj1acdMb7AxKL/t1vVCcXt6NSaEiTfYbCes1b4Qs8l54buR17oQdsP9p0lpx0ojKaSdjzER9ftagPpr/5byPZhyxsQNU/V9dzoIx4eVV2sSiuFq4XFNL48v6wZz3znX4IlLenGji8=";
const username = "l.yopa@services.ceo";
const password = "password";

(async () => {
  console.log("appID: ", appId);
  console.log("appSecret: ", appSecret);
  const smpClient = new SMPClient(appId, appSecret, "https://dev.api.services.ceo");
  await smpClient.authenticateApp();

  // // Authenticate the user
  // await smpClient.authenticateUser(username, password);

  // const apiClient = smpClient.httpClient;
  // const posts = await apiClient.query(GET_SERVICE_BY_AUTHOR_ID, { userId: "user-id" });

  // console.log("Posts:", posts);
})();