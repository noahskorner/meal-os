export type PaginatedResponse<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
