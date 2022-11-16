import { QueryEntitySiger } from "../../../../service/siger";
import {
  AccumulatedStock,
  AccumulatedStockExtraFields,
  AccumulatedStockFields,
} from "../../model/AccumulatedStock";

export type QueryAccumulatedStockRepositoryDTO = QueryEntitySiger<
  AccumulatedStockFields,
  AccumulatedStockExtraFields
>;

export interface IAccumulatedStockRepository {
  getAll(
    query: QueryAccumulatedStockRepositoryDTO
  ): Promise<AccumulatedStock[]>;
}
