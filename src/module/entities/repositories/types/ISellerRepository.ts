import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { Seller, SellerFields } from "../../model/Seller";

export type QuerySellerFindAllDTO = QueryFindAllEntitySiger<SellerFields>;
export type QuerySellerCountDTO = QueryCountEntitySiger;

export interface ISellerRepository {
  findAll(query: QuerySellerFindAllDTO): Promise<Seller[]>;
  count(query: QuerySellerCountDTO): Promise<number>;
}
