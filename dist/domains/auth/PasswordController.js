// smp-sdk-ts/src/forgotpassword/estimate.ts
import { authMutations } from '../../api/graphql/index.js';
const { MUTATION_FORGOT_PASSWORD, MUTATION_RESET_PASSWORD, MUTATION_UPDATE_PASSWORD } = authMutations;
export class Password {
    constructor(client) {
        this.client = client;
    }
    async forgotPassword(email) {
        const mutation = MUTATION_FORGOT_PASSWORD;
        const variables = { email };
        const response = await this.client.mutate(mutation, variables);
        return response.forgotPassword;
    }
    async resetPassword(input) {
        const mutation = MUTATION_RESET_PASSWORD;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.resetPassword;
    }
    async updatePassword(input, userID) {
        const mutation = MUTATION_UPDATE_PASSWORD;
        const variables = { input, userID };
        const response = await this.client.mutate(mutation, variables);
        return response.updatePassword;
    }
}
