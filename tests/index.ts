
import { SMPClient } from "../src/smp/SMPClient";
import { HttpClient } from "../src/utils/HttpClient";
import { GET_SERVICE_BY_AUTHOR_ID } from "../src/api/graphql/queries/servicesQueries";

const appId = "your-app-id";
const appSecret = "your-app-secret";
const username = "user";
const password = "password";

(async () => {
  const smpClient = new SMPClient(appId, appSecret);
  await smpClient.authenticateApp();

  // Authenticate the user
  await smpClient.authenticateUser(username, password);

  const apiClient = new HttpClient();
  const posts = await apiClient.graphql(GET_SERVICE_BY_AUTHOR_ID, { userId: "user-id" });

  console.log("Posts:", posts);
})();

