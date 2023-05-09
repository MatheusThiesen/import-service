import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
  QueryFindFirstEntitySiger,
} from "../../../../service/siger";

export interface ITypeRepository {
  findAll<T, D>(query: QueryFindAllEntitySiger<T>): Promise<D[]>;
  count(query: QueryCountEntitySiger): Promise<number>;
  findOne<T, D>(query: QueryFindFirstEntitySiger<T>): Promise<D>;
}
