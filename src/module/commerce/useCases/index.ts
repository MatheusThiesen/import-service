import { AuthorizationRepository } from "../repositories/AuthorizationRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { entities } from "./../../entities/useCases/index";
import { BrandImportCommerce } from "./BrandImportCommerce";
import { CollectionImportCommerce } from "./CollectionImportCommerce";
import { ColorImportCommerce } from "./ColorImportCommerce";
import { GroupImportCommerce } from "./GroupImportCommerce";
import { LineImportCommerce } from "./LineImportCommerce";
import { ListPriceImportCommerce } from "./ListPriceImportCommerce";
import { OrderItemImportCommerce } from "./OrderItemsImportCommerce";
import { ProductImportCommerce } from "./ProductImportCommerce";
import { PurchaseOrderCommerce } from "./PurchaseOrderCommerce";
import { StockFutureCommerce } from "./StockFutureCommerce";
import { StockLocationImportCommerce } from "./StockLocationImportCommerce";
import { StockPromptDeliveryCommerce } from "./StockPromptDeliveryCommerce";
import { SubGroupImportCommerce } from "./SubGroupImportCommerce";

const authorization = new AuthorizationRepository();

export const sendData = new SendDataRepository(authorization);
export const colorImportCommerce = new ColorImportCommerce(
  sendData,
  entities.color
);
export const groupImportCommerce = new GroupImportCommerce(
  sendData,
  entities.productGroup
);
export const subgroupImportCommerce = new SubGroupImportCommerce(
  sendData,
  entities.productSubgroup
);
export const lineImportCommerce = new LineImportCommerce(
  sendData,
  entities.productLine
);
export const brandImportCommerce = new BrandImportCommerce(
  sendData,
  entities.brand
);
export const collectionImportCommerce = new CollectionImportCommerce(
  sendData,
  entities.productCollection
);
export const productImportCommerce = new ProductImportCommerce(sendData);
export const stockLocationImportCommerce = new StockLocationImportCommerce(
  sendData,
  entities.purchaseOrderItems,
  entities.accumulatedStock,
  entities.orderItem
);
export const stockPromptDeliveryCommerce = new StockPromptDeliveryCommerce(
  sendData
);
export const purchaseOrderCommerce = new PurchaseOrderCommerce(
  sendData,
  entities.purchaseOrderItems
);
export const orderItemImportCommerce = new OrderItemImportCommerce(
  sendData,
  entities.orderItem
);
export const listPriceImportCommerce = new ListPriceImportCommerce(
  sendData,
  entities.itemPriceListRepository
);
export const stockFutureCommerce = new StockFutureCommerce(sendData);
