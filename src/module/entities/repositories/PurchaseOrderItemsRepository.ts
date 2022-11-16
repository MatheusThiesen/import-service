import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { PurchaseOrderItems } from "../model/PurchaseOrderItems";
import {
  IPurchaseOrderItemsRepository,
  QueryPurchaseOrderItemsRepositoryDTO,
} from "./types/IPurchaseOrderItemsRepository";

export class PurchaseOrderItemsRepository
  implements IPurchaseOrderItemsRepository
{
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryPurchaseOrderItemsRepositoryDTO): Promise<PurchaseOrderItems[]> {
    const purchaseOrderItems = await apiSiger.get<SigerDTO<PurchaseOrderItems>>(
      "/api/v1/get-list",
      {
        params: {
          entity: "purchaseOrderItems",
          search: search,
          fields: filterFieldsNormalized(fields),
          extraFields: filterFieldsNormalized(extraFields),
        },
      }
    );

    return purchaseOrderItems.data.content;
  }
}
