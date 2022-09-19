import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { ProductGroup } from "../model/ProductGroup";
import {
  IProductGroupRepository,
  QueryProductGroupDTO,
} from "./types/IProductGroupRepository";

export class ProductGroupRepository implements IProductGroupRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryProductGroupDTO): Promise<ProductGroup[]> {
    const productGroups = await apiSiger.get<SigerDTO<ProductGroup>>(
      "/api/v1/get-list",
      {
        params: {
          entity: "productGroup",
          search: search,
          fields: filterFieldsNormalized(fields),
          extraFields: filterFieldsNormalized(extraFields),
        },
      }
    );

    return productGroups.data.content;
  }
}
