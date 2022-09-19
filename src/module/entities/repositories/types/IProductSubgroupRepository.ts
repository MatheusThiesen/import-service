import { QueryEntitySiger } from "../../../../service/siger";
import {
  ProductSubgroup,
  ProductSubgroupExtraFields,
  ProductSubgroupFields,
} from "../../model/ProductSubgroup";

export type QueryProductSubgroupDTO = QueryEntitySiger<
  ProductSubgroupFields,
  ProductSubgroupExtraFields
>;

export interface IProductSubgroupRepository {
  getAll(query: QueryProductSubgroupDTO): Promise<ProductSubgroup[]>;
}
