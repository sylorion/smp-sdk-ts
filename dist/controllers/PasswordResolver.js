// smp-sdk-ts/src/forgotpassword/estimate.ts
import { MUTATION_FORGOT_PASSWORD, MUTATION_RESET_PASSWORD } from '../api/graphql/mutations/authMutations.js';
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
        console.log(input);
        const mutation = MUTATION_RESET_PASSWORD;
        console.log(mutation);
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.resetPassword;
    }
}
