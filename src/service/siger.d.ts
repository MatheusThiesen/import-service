export interface SigerDTO<T> {
  content: T[];

  status: {
    message: string;
    code: number;
  };

  pageable: {
    page: number;
    size: number;
    pageSize: number;
    pageNumber: number;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalElements: number;
  numberOfElements: number;
  totalPages: number;
}

export interface QueryEntitySiger<T, E> {
  fields: T;
  extraFields?: E;
  search?: string;

  isPagination?: boolean;
  size?: number;
  page?: number;
}
