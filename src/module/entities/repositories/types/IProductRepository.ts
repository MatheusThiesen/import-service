import { QueryEntitySiger } from "../../../../service/siger";
import {
  Product,
  ProductExtraFields,
  ProductFields,
} from "../../model/Product";

export type QueryProductDTO = QueryEntitySiger<
  ProductFields,
  ProductExtraFields
>;

export interface IProductRepository {
  getAll(query: QueryProductDTO): Promise<Product[]>;
}
