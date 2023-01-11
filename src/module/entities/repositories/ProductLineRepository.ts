import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { ProductLine } from "../model/ProductLine";
import { GetListAll } from "../useCases/GetListAll";

import {
  IProductLineRepository,
  QueryProductLineDTO,
} from "./types/IProductLineRepository";

export class ProductLineRepository implements IProductLineRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
  }: QueryProductLineDTO): Promise<ProductLine[]> {
    const productLines = await this.getListAll.execute<ProductLine>({
      entity: "productLine",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
    });

    return productLines;
  }
}
