import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { ProductSubgroup } from "../model/ProductSubgroup";
import { GetListAll } from "../useCases/GetListAll";
import {
  IProductSubgroupRepository,
  QueryProductSubgroupDTO,
} from "./types/IProductSubgroupRepository";

export class ProductSubgroupRepository implements IProductSubgroupRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
  }: QueryProductSubgroupDTO): Promise<ProductSubgroup[]> {
    const productSubgroups = await this.getListAll.execute<ProductSubgroup>({
      entity: "productSubgroup",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
    });

    return productSubgroups;
  }
}
