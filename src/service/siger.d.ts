export interface SigerDTO<T> {
  content: T[];
  status: {
    message: string;
    code: number;
  };
}

export interface QueryEntitySiger<T, E> {
  fields: T;
  extraFields?: E;
  search?: string;
}
