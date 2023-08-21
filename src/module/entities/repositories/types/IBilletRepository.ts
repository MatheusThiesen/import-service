import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { Billet, BilletFields } from "../../model/Billet";

export type QueryBilletFindAllDTO = QueryFindAllEntitySiger<BilletFields>;
export type QueryBilletCountDTO = QueryCountEntitySiger;

export interface IBilletRepository {
  findAll(query: QueryBilletFindAllDTO): Promise<Billet[]>;
  count(query: QueryBilletCountDTO): Promise<number>;
}
