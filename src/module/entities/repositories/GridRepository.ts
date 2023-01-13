import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { Grid } from "../model/Grid";
import { GetListAll } from "../useCases/GetListAll";
import { IGridRepository, QueryGridDTO } from "./types/IGridRepository";

export class GridRepository implements IGridRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
    page,
    size,
    isPagination,
  }: QueryGridDTO) {
    const grids = await this.getListAll.execute<Grid>({
      entity: "grid",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
      page,
      size,
      isPagination,
    });

    return grids;
  }
}
