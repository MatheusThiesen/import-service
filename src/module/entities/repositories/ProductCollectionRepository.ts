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
  }: QueryProductCollectionDTO): Promise<ProductCollection[]> {
    const productCollections = await this.getListAll.execute<ProductCollection>(
      {
        entity: "productCollection",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
      }
    );

    return productCollections;
  }
}
