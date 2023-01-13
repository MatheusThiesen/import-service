import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { ProductCollection } from "../model/ProductCollection";
import { GetListAll } from "../useCases/GetListAll";

import {
  IProductCollectionRepository,
  QueryProductCollectionDTO,
} from "./types/IProductCollectionRepository";

export class ProductCollectionRepository
  implements IProductCollectionRepository
{
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
    page,
    size,
    isPagination,
  }: QueryProductCollectionDTO) {
    const productCollections = await this.getListAll.execute<ProductCollection>(
      {
        entity: "productCollection",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
        page,
        size,
        isPagination,
      }
    );

    return productCollections;
  }
}
