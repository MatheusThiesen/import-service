import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
  QueryFindFirstEntitySiger,
} from "../../../../service/siger";

export interface ITypeRepository<T, D> {
  findAll(query: QueryFindAllEntitySiger<T>): Promise<D[]>;
  count(query: QueryCountEntitySiger): Promise<number>;
  findFirst(query: QueryFindFirstEntitySiger<T>): Promise<D>;
}
