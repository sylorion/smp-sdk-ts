export interface MutationResponse {
    success: boolean;
    message: string;
}

export interface PaginationInput {
    page?: number;
    limit?: number;
    [key: string]: any;
}

export interface SortInput {
    field?: string;
    order?: "ASC" | "DESC";
    [key: string]: any;
}
