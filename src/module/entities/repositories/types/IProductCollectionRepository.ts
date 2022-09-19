import { QueryEntitySiger } from "../../../../service/siger";
import {
  ProductCollection,
  ProductCollectionExtraFields,
  ProductCollectionFields,
} from "../../model/ProductCollection";

export type QueryProductCollectionDTO = QueryEntitySiger<
  ProductCollectionFields,
  ProductCollectionExtraFields
>;

export interface IProductCollectionRepository {
  getAll(query: QueryProductCollectionDTO): Promise<ProductCollection[]>;
}
