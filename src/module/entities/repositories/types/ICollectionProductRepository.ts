import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import {
  CollectionProduct,
  CollectionProductFields,
} from "../../model/CollectionProduct";

export type QueryCollectionProductFindAllDTO =
  QueryFindAllEntitySiger<CollectionProductFields>;
export type QueryCollectionProductCountDTO = QueryCountEntitySiger;

export interface ICollectionProductRepository {
  findAll(
    query: QueryCollectionProductFindAllDTO
  ): Promise<CollectionProduct[]>;
  count(query: QueryCollectionProductCountDTO): Promise<number>;
}
