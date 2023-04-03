import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { GroupProduct, GroupProductFields } from "../../model/GroupProduct";

export type QueryGroupProductFindAllDTO =
  QueryFindAllEntitySiger<GroupProductFields>;
export type QueryGroupProductCountDTO = QueryCountEntitySiger;

export interface IGroupProductRepository {
  findAll(query: QueryGroupProductFindAllDTO): Promise<GroupProduct[]>;
  count(query: QueryGroupProductCountDTO): Promise<number>;
}
