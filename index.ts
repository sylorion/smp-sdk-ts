
import { SMPAPIClient, statusByServices, GET_SERVICE_BY_AUTHOR_ID } from './src'; 
export * from './src';

const smpApi = new SMPAPIClient();

async function fn() {
  console.log("ClientResponse:@@@@@@@@@@@-----%%%%%%%% ",  new Date());
  return await smpApi.query(statusByServices("catalog"), {})
    .then((result) => {
      console.log("Then result: ", result);
      return result
    })
    .catch((result: string) => {
      console.log("Catch error: ", result);
      return result
    }) ;
}

const r = fn();  
