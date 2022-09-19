import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { Color } from "../model/Color";
import { IColorRepository, QueryColorDTO } from "./types/IColorRepository";

export class ColorRepository implements IColorRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryColorDTO): Promise<Color[]> {
    const colors = await apiSiger.get<SigerDTO<Color>>("/api/v1/get-list", {
      params: {
        entity: "colors",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
      },
    });

    return colors.data.content;
  }
}
