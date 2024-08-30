import { SMPAPIClient } from "./src/api/SMPAPIClient.js";
import { statusByServices } from './src/api/graphql/queries/index.js';
import { GET_SERVICE_BY_AUTHOR_ID } from "./src/api/graphql/queries/index.js"; 

export { SMPAPIClient, statusByServices, GET_SERVICE_BY_AUTHOR_ID };
const smpApi = new SMPAPIClient();

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
