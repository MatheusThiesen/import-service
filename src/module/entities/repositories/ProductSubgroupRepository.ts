import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { ProductSubgroup } from "../model/ProductSubgroup";
import {
  IProductSubgroupRepository,
  QueryProductSubgroupDTO,
} from "./types/IProductSubgroupRepository";

export class ProductSubgroupRepository implements IProductSubgroupRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryProductSubgroupDTO): Promise<ProductSubgroup[]> {
    const productSubgroups = await apiSiger.get<SigerDTO<ProductSubgroup>>(
      "/api/v1/get-list",
      {
        params: {
          entity: "productSubgroup",
          search: search,
          fields: filterFieldsNormalized(fields),
          extraFields: filterFieldsNormalized(extraFields),
        },
      }
    );

    return productSubgroups.data.content;
  }
}
