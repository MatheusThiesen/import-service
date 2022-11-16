import { QueryEntitySiger } from "../../../../service/siger";
import {
  PurchaseOrderItems,
  PurchaseOrderItemsExtraFields,
  PurchaseOrderItemsFields,
} from "../../model/PurchaseOrderItems";

export type QueryPurchaseOrderItemsRepositoryDTO = QueryEntitySiger<
  PurchaseOrderItemsFields,
  PurchaseOrderItemsExtraFields
>;

export interface IPurchaseOrderItemsRepository {
  getAll(
    query: QueryPurchaseOrderItemsRepositoryDTO
  ): Promise<PurchaseOrderItems[]>;
}
