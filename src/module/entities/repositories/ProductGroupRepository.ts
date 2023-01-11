import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { ProductGroup } from "../model/ProductGroup";
import { GetListAll } from "../useCases/GetListAll";
import {
  IProductGroupRepository,
  QueryProductGroupDTO,
} from "./types/IProductGroupRepository";

export class ProductGroupRepository implements IProductGroupRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
  }: QueryProductGroupDTO): Promise<ProductGroup[]> {
    const productGroups = await this.getListAll.execute<ProductGroup>({
      entity: "productGroup",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
    });

    return productGroups;
  }
}
