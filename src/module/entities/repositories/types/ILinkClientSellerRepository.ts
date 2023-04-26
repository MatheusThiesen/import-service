import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import {
  LinkClientSeller,
  LinkClientSellerFields,
} from "../../model/LinkClientSeller";

export type QueryLinkClientSellerFindAllDTO =
  QueryFindAllEntitySiger<LinkClientSellerFields>;
export type QueryLinkClientSellerCountDTO = QueryCountEntitySiger;

export interface ILinkClientSellerRepository {
  findAll(query: QueryLinkClientSellerFindAllDTO): Promise<LinkClientSeller[]>;
  count(query: QueryLinkClientSellerCountDTO): Promise<number>;
}
