import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { PurchaseOrderItems } from "../model/PurchaseOrderItems";
import { GetListAll } from "../useCases/GetListAll";
import {
  IPurchaseOrderItemsRepository,
  QueryPurchaseOrderItemsRepositoryDTO,
} from "./types/IPurchaseOrderItemsRepository";

export class PurchaseOrderItemsRepository
  implements IPurchaseOrderItemsRepository
{
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
  }: QueryPurchaseOrderItemsRepositoryDTO): Promise<PurchaseOrderItems[]> {
    const purchaseOrderItems =
      await this.getListAll.execute<PurchaseOrderItems>({
        entity: "purchaseOrderItems",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
        limit: 500,
      });

    return purchaseOrderItems;
  }
}
