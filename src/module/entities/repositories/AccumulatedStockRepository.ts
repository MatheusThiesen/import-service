import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { AccumulatedStock } from "../model/AccumulatedStock";
import { GetListAll } from "../useCases/GetListAll";
import {
  IAccumulatedStockRepository,
  QueryAccumulatedStockRepositoryDTO,
} from "./types/IAccumulatedStockRepository";

export class AccumulatedStockRepository implements IAccumulatedStockRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
    page,
    size,
    isPagination,
  }: QueryAccumulatedStockRepositoryDTO) {
    const AccumulatedStock = await this.getListAll.execute<AccumulatedStock>({
      entity: "accumulatedStock",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
      limit: 1000,
      page,
      size,
      isPagination,
    });

    return AccumulatedStock;
  }
}
