import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { PriceList, PriceListFields } from "../../model/PriceList";

export type QueryPriceListFindAllDTO = QueryFindAllEntitySiger<PriceListFields>;
export type QueryPriceListCountDTO = QueryCountEntitySiger;

export interface IPriceListRepository {
  findAll(query: QueryPriceListFindAllDTO): Promise<PriceList[]>;
  count(query: QueryPriceListCountDTO): Promise<number>;
}
