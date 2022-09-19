import { QueryEntitySiger } from "../../../../service/siger";
import {
  ProductGroup,
  ProductGroupExtraFields,
  ProductGroupFields,
} from "../../model/ProductGroup";

export type QueryProductGroupDTO = QueryEntitySiger<
  ProductGroupFields,
  ProductGroupExtraFields
>;

export interface IProductGroupRepository {
  getAll(query: QueryProductGroupDTO): Promise<ProductGroup[]>;
}
