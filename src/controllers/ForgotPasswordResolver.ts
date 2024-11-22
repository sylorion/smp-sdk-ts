// smp-sdk-ts/src/forgotpassword/estimate.ts

import { APIClient } from '../api/APIClient';
import {MUTATION_FORGOT_PASSWORD} from '../api/graphql/mutations/authMutations';    

export interface ForgotPasswordInput {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
    success: boolean;
}

export class ForgotPassword {
    private client: APIClient;

    constructor(client: APIClient) {
        this.client = client;
    }

    async forgotPassword(input: ForgotPasswordInput): Promise<ForgotPasswordResponse> {
        const mutation = MUTATION_FORGOT_PASSWORD;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables) as { forgotPassword: ForgotPasswordResponse };
        return response.forgotPassword;
    }
}