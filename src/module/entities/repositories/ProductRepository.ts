import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";

import { Product } from "../model/Product";
import { GetListAll } from "../useCases/GetListAll";
import {
  IProductRepository,
  QueryProductDTO,
} from "./types/IProductRepository";

export class ProductRepository implements IProductRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
    page,
    size,
    isPagination,
  }: QueryProductDTO) {
    const payments = await this.getListAll.execute<Product>({
      entity: "product",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
      page,
      size,
      isPagination,
    });

    return payments;
  }
}
