import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
  QueryFindFirstEntitySiger,
} from "../../../../service/siger";
import { EanProduct, EanProductFields } from "../../model/EanProduct";

export type QueryEanProductFindAllDTO =
  QueryFindAllEntitySiger<EanProductFields>;
export type QueryEanProductCountDTO = QueryCountEntitySiger;

export type QueryEanProductFindFirstDTO =
  QueryFindFirstEntitySiger<EanProductFields>;

export interface IEanProductRepository {
  findAll(query: QueryEanProductFindAllDTO): Promise<EanProduct[]>;
  count(query: QueryEanProductCountDTO): Promise<number>;
  findFirst(query: QueryEanProductFindFirstDTO): Promise<EanProduct | null>;
}
