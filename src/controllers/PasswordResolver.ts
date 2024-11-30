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

export class Password {
    private client: APIClient;

    constructor(client: APIClient) {
        this.client = client;
    }
    async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
        const mutation = MUTATION_FORGOT_PASSWORD;
        const variables = { email }; // Transmettez directement l'email
        const response = await this.client.mutate(mutation, variables) as { forgotPassword: ForgotPasswordResponse };
        return response.forgotPassword;
    }
    
}