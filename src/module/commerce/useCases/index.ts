import { AuthorizationRepository } from "../repositories/AuthorizationRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { entities } from "./../../entities/useCases/index";
import { BrandImportCommerce } from "./BrandImportCommerce";
import { CollectionImportCommerce } from "./CollectionImportCommerce";
import { ColorImportCommerce } from "./ColorImportCommerce";
import { GroupImportCommerce } from "./GroupImportCommerce";
import { LineImportCommerce } from "./LineImportCommerce";
import { ProductImportCommerce } from "./ProductImportCommerce";
import { StockLocationImportCommerce } from "./StockLocationImportCommerce";
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
export const productImportCommerce = new ProductImportCommerce(
  sendData,
  entities.product
);
export const stockLocationImportCommerce = new StockLocationImportCommerce(
  sendData,
  entities.purchaseOrderItems,
  entities.accumulatedStock,
  entities.orderItem,
  entities.product
);
