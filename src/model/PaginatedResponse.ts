export interface PaginatedResponse<T> {
  items: T[];
  PageNumber: number;
  PageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
} 