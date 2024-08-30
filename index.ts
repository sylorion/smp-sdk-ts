import { SMPApiClient } from "./src/api/SMPApiClient.js";
import { statusByServices } from './src/api/graphql/queries/index.js';
import { GET_SERVICE_BY_AUTHOR_ID } from "./src/api/graphql/queries/index.js"; 

export { SMPApiClient, statusByServices, GET_SERVICE_BY_AUTHOR_ID };
const smpApi = new SMPApiClient();

// async function fn() {
//   return await smpApi.query(statusByServices("accounting"), {})
//     .then((result) => {
//       console.log("Then result: ", result);
//       return result
//     })
//     .catch((result: string) => {
//       console.log("Catch error: ", result);
//       return result
//     }) ;
// }

// const r = fn();  
