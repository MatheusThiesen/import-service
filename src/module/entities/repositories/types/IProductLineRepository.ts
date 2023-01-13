import { QueryEntitySiger } from "../../../../service/siger";
import {
  ProductLine,
  ProductLineExtraFields,
  ProductLineFields,
} from "../../model/ProductLine";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryProductLineDTO = QueryEntitySiger<
  ProductLineFields,
  ProductLineExtraFields
>;

export interface IProductLineRepository {
  getAll(query: QueryProductLineDTO): Promise<GetListAllResponse<ProductLine>>;
}
