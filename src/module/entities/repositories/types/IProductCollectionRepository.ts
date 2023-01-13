import { QueryEntitySiger } from "../../../../service/siger";
import {
  ProductCollection,
  ProductCollectionExtraFields,
  ProductCollectionFields,
} from "../../model/ProductCollection";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryProductCollectionDTO = QueryEntitySiger<
  ProductCollectionFields,
  ProductCollectionExtraFields
>;

export interface IProductCollectionRepository {
  getAll(
    query: QueryProductCollectionDTO
  ): Promise<GetListAllResponse<ProductCollection>>;
}
