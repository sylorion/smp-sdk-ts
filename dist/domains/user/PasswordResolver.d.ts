import { APIClient } from '../../api/APIClient.js';
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
export declare class Password {
    private client;
    constructor(client: APIClient);
    forgotPassword(email: string): Promise<ForgotPasswordResponse>;
    resetPassword(input: ResetPasswordInput): Promise<ResetPasswordResponse>;
}
