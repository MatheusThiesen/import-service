import { QueryEntitySiger } from "../../../../service/siger";
import {
  AccumulatedStock,
  AccumulatedStockExtraFields,
  AccumulatedStockFields,
} from "../../model/AccumulatedStock";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryAccumulatedStockRepositoryDTO = QueryEntitySiger<
  AccumulatedStockFields,
  AccumulatedStockExtraFields
>;

export interface IAccumulatedStockRepository {
  getAll(
    query: QueryAccumulatedStockRepositoryDTO
  ): Promise<GetListAllResponse<AccumulatedStock>>;
}
