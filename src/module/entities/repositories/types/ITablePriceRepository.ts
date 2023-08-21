import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { TablePrice, TablePriceFields } from "../../model/TablePrice";

export type QueryTablePriceFindAllDTO =
  QueryFindAllEntitySiger<TablePriceFields>;
export type QueryTablePriceCountDTO = QueryCountEntitySiger;

export interface ITablePriceRepository {
  findAll(query: QueryTablePriceFindAllDTO): Promise<TablePrice[]>;
  count(query: QueryTablePriceCountDTO): Promise<number>;
}
