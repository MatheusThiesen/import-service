import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { GridProduct, GridProductFields } from "../../model/GridProduct";

export type QueryGridProductFindAllDTO =
  QueryFindAllEntitySiger<GridProductFields>;
export type QueryGridProductCountDTO = QueryCountEntitySiger;

export interface IGridProductRepository {
  findAll(query: QueryGridProductFindAllDTO): Promise<GridProduct[]>;
  count(query: QueryGridProductCountDTO): Promise<number>;
}
