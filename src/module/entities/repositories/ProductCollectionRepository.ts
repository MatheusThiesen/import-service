import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { ProductCollection } from "../model/ProductCollection";

import {
  IProductCollectionRepository,
  QueryProductCollectionDTO,
} from "./types/IProductCollectionRepository";

export class ProductCollectionRepository
  implements IProductCollectionRepository
{
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryProductCollectionDTO): Promise<ProductCollection[]> {
    const productCollections = await apiSiger.get<SigerDTO<ProductCollection>>(
      "/api/v1/get-list",
      {
        params: {
          entity: "productCollection",
          search: search,
          fields: filterFieldsNormalized(fields),
          extraFields: filterFieldsNormalized(extraFields),
        },
      }
    );

    return productCollections.data.content;
  }
}
