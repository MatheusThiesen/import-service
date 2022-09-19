import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";

import { Product } from "../model/Product";
import {
  IProductRepository,
  QueryProductDTO,
} from "./types/IProductRepository";

export class ProductRepository implements IProductRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryProductDTO): Promise<Product[]> {
    const payments = await apiSiger.get<SigerDTO<Product>>("/api/v1/get-list", {
      params: {
        entity: "product",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
      },
    });

    return payments.data.content;
  }
}
