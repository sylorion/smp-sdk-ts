import { statusByServices } from './api/graphql/queries/index.js';
import { GET_SERVICE_BY_AUTHOR_ID } from "./api/graphql/queries/index.js";
import { APIClient } from "./api/APIClient.js"
import { SMPClient } from "./smp/SMPClient.js"
import { Persistence } from './config/Persistence.js';
import { defaultLanguage } from './i18n/languages.js';
export { SMPClient, APIClient, GET_SERVICE_BY_AUTHOR_ID, statusByServices } ;


const SMP_API_URL="https://dev-authentication.sh1.hidora.net";
const SMP_GRAPHQL_URL = "https://dev-gateway.sh1.hidora.net/";
const SMP_DEFAULT_LANGUAGE = 'fr_FR';
const appId = "f2655ffda8594852";
const appSecret = "TA7Vin/JY0YIp9sGpiy6d7ade351Ub+Ia3Pj1acdMb7AxKL/t1vVCcXt6NSaEiTfYbCes1b4Qs8l54buR17oQdsP9p0lpx0ojKaSdjzER9ftagPpr/5byPZhyxsQNU/V9dzoIx4eVV2sSiuFq4XFNL48v6wZz3znX4IlLenGji8=";
const username = "l.yopa@services.ceo";
const password = "password";
const confOpts = {
      appId: 'f2655ffda8594852',
      appSecret: 'TA7Vin/JY0YIp9sGpiy6d7ade351Ub+Ia3Pj1acdMb7AxKL/t1vVCcXt6NSaEiTfYbCes1b4Qs8l54buR17oQdsP9p0lpx0ojKaSdjzER9ftagPpr/5byPZhyxsQNU/V9dzoIx4eVV2sSiuFq4XFNL48v6wZz3znX4IlLenGji8=',
      apiUrl: '"https://dev-authentication.sh1.hidora.net/graphql"',
      graphqlUrl: SMP_GRAPHQL_URL,
      defaultLanguage: defaultLanguage,
      appAccessDuration: 30, // 1 heure
      userAccessDuration: 30, // 1 heure
      minUserAccessDuration: 30, // 1 heure
      minAppAccessDuration: 30, // 1 heure
      persistence: Persistence.MemoryKind,
      storage: new Persistence(Persistence.MemoryKind),
    };
    const smpClient = new SMPClient(confOpts);
(async () => {
  console.log("appID: ", appId);
  console.log("appSecret: ", appSecret);
  const smpClient = new SMPClient(confOpts);
  // await smpClient.authenticateApp();
  function wait(n:number) {
    return new Promise(resolve => {
      setTimeout(resolve, n * 1000); // Convertir les secondes en millisecondes
    });
  }
  
  // Authenticate the user
  const timeA = new Date();
  await smpClient.authenticateUser(username, password).then(
    (response) => {
      console.log("User authenticated: ", response);
    }
  )
  const timeB = new Date();
  console.log("##############################\n##############################");
  console.log("time to authenticate user: ", (timeB.getTime() - timeA.getTime()));
  console.log(`Start Auth :  ${timeA} - End auth at ${timeA}`);
  let count = 1
  while (count < 30) {
    count++;
    await wait(count);
  }
})();
console.log(`End OF TEST PROGRAM\n\n\n`);
