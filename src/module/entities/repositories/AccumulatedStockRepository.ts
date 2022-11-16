import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { AccumulatedStock } from "../model/AccumulatedStock";
import {
  IAccumulatedStockRepository,
  QueryAccumulatedStockRepositoryDTO,
} from "./types/IAccumulatedStockRepository";

export class AccumulatedStockRepository implements IAccumulatedStockRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryAccumulatedStockRepositoryDTO): Promise<AccumulatedStock[]> {
    const AccumulatedStock = await apiSiger.get<SigerDTO<AccumulatedStock>>(
      "/api/v1/get-list",
      {
        params: {
          entity: "accumulatedStock",
          search: search,
          fields: filterFieldsNormalized(fields),
          extraFields: filterFieldsNormalized(extraFields),
        },
      }
    );

    return AccumulatedStock.data.content;
  }
}
