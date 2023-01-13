import { QueryEntitySiger } from "../../../../service/siger";
import {
  ProductGroup,
  ProductGroupExtraFields,
  ProductGroupFields,
} from "../../model/ProductGroup";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryProductGroupDTO = QueryEntitySiger<
  ProductGroupFields,
  ProductGroupExtraFields
>;

export interface IProductGroupRepository {
  getAll(
    query: QueryProductGroupDTO
  ): Promise<GetListAllResponse<ProductGroup>>;
}
