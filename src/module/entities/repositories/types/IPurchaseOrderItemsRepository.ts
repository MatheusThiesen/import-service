import { QueryEntitySiger } from "../../../../service/siger";
import {
  PurchaseOrderItems,
  PurchaseOrderItemsExtraFields,
  PurchaseOrderItemsFields,
} from "../../model/PurchaseOrderItems";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryPurchaseOrderItemsRepositoryDTO = QueryEntitySiger<
  PurchaseOrderItemsFields,
  PurchaseOrderItemsExtraFields
>;

export interface IPurchaseOrderItemsRepository {
  getAll(
    query: QueryPurchaseOrderItemsRepositoryDTO
  ): Promise<GetListAllResponse<PurchaseOrderItems>>;
}
