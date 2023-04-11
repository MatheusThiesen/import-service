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

export interface QueryEntitySiger<T> {
  fields: T;
  search?: string;
  pagesize?: number;
  page?: number;
}

export interface QueryFindAllEntitySiger<T> {
  fields: T;
  search?: string;
  pagesize?: number;
  page?: number;
}

export interface QueryFindFirstEntitySiger<T> {
  fields: T;
  search?: string;
}

export interface QueryCountEntitySiger {
  search?: string;
}
