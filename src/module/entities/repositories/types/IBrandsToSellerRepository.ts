import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import {
  BrandsToSeller,
  BrandsToSellerFields,
} from "../../model/BrandsToSeller";

export type QueryBrandsToSellerFindAllDTO =
  QueryFindAllEntitySiger<BrandsToSellerFields>;
export type QueryBrandsToSellerCountDTO = QueryCountEntitySiger;

export interface IBrandsToSellerRepository {
  findAll(query: QueryBrandsToSellerFindAllDTO): Promise<BrandsToSeller[]>;
  count(query: QueryBrandsToSellerCountDTO): Promise<number>;
}
