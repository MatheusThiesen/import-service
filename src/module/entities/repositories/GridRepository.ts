import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { Grid } from "../model/Grid";
import { IGridRepository, QueryGridDTO } from "./types/IGridRepository";

export class GridRepository implements IGridRepository {
  async getAll({ fields, extraFields, search }: QueryGridDTO): Promise<Grid[]> {
    const grids = await apiSiger.get<SigerDTO<Grid>>("/api/v1/get-list", {
      params: {
        entity: "grid",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
      },
    });

    return grids.data.content;
  }
}
