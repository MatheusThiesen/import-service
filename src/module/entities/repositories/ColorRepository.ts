import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { Color } from "../model/Color";
import { GetListAll } from "../useCases/GetListAll";
import { IColorRepository, QueryColorDTO } from "./types/IColorRepository";

export class ColorRepository implements IColorRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
  }: QueryColorDTO): Promise<Color[]> {
    const colors = await this.getListAll.execute<Color>({
      entity: "colors",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
    });

    return colors;
  }
}
