import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { ProductLine } from "../model/ProductLine";

import {
  IProductLineRepository,
  QueryProductLineDTO,
} from "./types/IProductLineRepository";

export class ProductLineRepository implements IProductLineRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryProductLineDTO): Promise<ProductLine[]> {
    const productLines = await apiSiger.get<SigerDTO<ProductLine>>(
      "/api/v1/get-list",
      {
        params: {
          entity: "productLine",
          search: search,
          fields: filterFieldsNormalized(fields),
          extraFields: filterFieldsNormalized(extraFields),
        },
      }
    );

    return productLines.data.content;
  }
}
