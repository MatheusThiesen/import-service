import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { LineProduct, LineProductFields } from "../../model/LineProduct";

export type QueryLineProductFindAllDTO =
  QueryFindAllEntitySiger<LineProductFields>;
export type QueryLineProductCountDTO = QueryCountEntitySiger;

export interface ILineProductRepository {
  findAll(query: QueryLineProductFindAllDTO): Promise<LineProduct[]>;
  count(query: QueryLineProductCountDTO): Promise<number>;
}
