// smp-sdk-ts/src/forgotpassword/estimate.ts

import { APIClient } from '../../api/APIClient.js';
import { authMutations } from '../../api/graphql/index.js';
const { MUTATION_FORGOT_PASSWORD, MUTATION_RESET_PASSWORD, MUTATION_UPDATE_PASSWORD } = authMutations;

export interface ForgotPasswordInput {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
    success: boolean;
    token?: string;
}

export interface ResetPasswordInput {
    token: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
    success: boolean;
}

export interface UpdatePasswordInput {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdatePasswordResponse {
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
        const variables = { email };
        const response = await this.client.mutate(mutation, variables) as { forgotPassword: ForgotPasswordResponse };
        return response.forgotPassword;
    }

    async resetPassword(input: ResetPasswordInput): Promise<ResetPasswordResponse> {
        const mutation = MUTATION_RESET_PASSWORD;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables) as { resetPassword: ResetPasswordResponse };
        return response.resetPassword;
    }

    async updatePassword(input: UpdatePasswordInput): Promise<UpdatePasswordResponse> {
        const mutation = MUTATION_UPDATE_PASSWORD;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables) as { updatePassword: UpdatePasswordResponse };
        return response.updatePassword;
    }
}
