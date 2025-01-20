// types/pagination.ts
export interface PaginationParams {
    limit: number;
    exclusiveStartKey?: Record<string, any>;
}
  
export interface PaginatedResult<T> {
    items: T[];
    lastEvaluatedKey?: Record<string, any>;
    count: number;
    scannedCount: number;
}
  
export interface PaginatedResponse<T> {
    data: T[];
    metadata: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}