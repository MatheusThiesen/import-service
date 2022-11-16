import { Product, ProductFields } from "./Product";

export class PurchaseOrderItems {
  purchaseItemID: number;
  deliveryDeadlineDate: string;
  itemStatus: number;
  openQuantity: number;
  canceledQuantity: number;
  quantityDelivered: number;
  requestedQuantity: number;
  lastRegistryChangeDate: string;
  lastRegistryChangeTime: number;

  product: Product;
}
export class PurchaseOrderItemsFields {
  purchaseItemID?: boolean;
  deliveryDeadlineDate?: boolean;
  itemStatus?: boolean;
  openQuantity?: boolean;
  canceledQuantity?: boolean;
  quantityDelivered?: boolean;
  requestedQuantity?: boolean;
  lastRegistryChangeDate?: boolean;
  lastRegistryChangeTime?: boolean;

  product: ProductFields;
}
export class PurchaseOrderItemsExtraFields {}
