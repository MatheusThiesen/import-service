import { AuthorizationRepository } from "../repositories/AuthorizationRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";

import { BilletImportCommerce } from "./BilletImportCommerce";
import { BillingLocationImportCommerce } from "./BillingLocationImportCommerce";
import { BranchActivistsImportCommerce } from "./BranchActivistsImportCommerce";
import { BrandImportCommerce } from "./BrandImportCommerce";
import { BrandsToSellerImportCommerce } from "./BrandsToSellerImportCommerce";
import { ClientImportCommerce } from "./ClientImportCommerce";
import { CollectionImportCommerce } from "./CollectionImportCommerce";
import { ColorImportCommerce } from "./ColorImportCommerce";
import { ConceptImportCommerce } from "./ConceptImportCommerce";
import { GroupImportCommerce } from "./GroupImportCommerce";
import { LineImportCommerce } from "./LineImportCommerce";
import { ListPriceImportCommerce } from "./ListPriceImportCommerce";
import { OrderImportCommerce } from "./OrderImportCommerce";
import { PaymentConditionImportCommerce } from "./PaymentConditionImportCommerce";
import { ProductImageImportCommerce } from "./ProductImageImportCommerce";
import { ProductImportCommerce } from "./ProductImportCommerce";
import { SellerImportCommerce } from "./SellerImportCommerce";
import { StockFutureCommerce } from "./StockFutureCommerce";
import { StockPromptDeliveryCommerce } from "./StockPromptDeliveryCommerce";
import { SubGroupImportCommerce } from "./SubGroupImportCommerce";
import { TablePriceImportCommerce } from "./TablePriceImportCommerce";
import { WalletSellerClientImportCommerce } from "./WalletSellerClientImportCommerce";

const authorization = new AuthorizationRepository();
export const sendData = new SendDataRepository(authorization);

export const brandImportCommerce = new BrandImportCommerce(sendData);
export const collectionImportCommerce = new CollectionImportCommerce(sendData);
export const colorImportCommerce = new ColorImportCommerce(sendData);
export const productImportCommerce = new ProductImportCommerce(sendData);
export const groupImportCommerce = new GroupImportCommerce(sendData);
export const lineImportCommerce = new LineImportCommerce(sendData);
export const listPriceImportCommerce = new ListPriceImportCommerce(sendData);
export const subGroupImportCommerce = new SubGroupImportCommerce(sendData);
export const conceptImportCommerce = new ConceptImportCommerce(sendData);
export const sellerImportCommerce = new SellerImportCommerce(sendData);
export const brandsToSellerImportCommerce = new BrandsToSellerImportCommerce(
  sendData
);
export const stockFutureCommerce = new StockFutureCommerce(sendData);
export const stockPromptDeliveryCommerce = new StockPromptDeliveryCommerce(
  sendData
);
export const branchActivistsImportCommerce = new BranchActivistsImportCommerce(
  sendData
);
export const clientImportCommerce = new ClientImportCommerce(sendData);
export const walletSellerClientImportCommerce =
  new WalletSellerClientImportCommerce(sendData);
export const productImageImportCommerce = new ProductImageImportCommerce(
  sendData
);
export const paymentConditionImportCommerce =
  new PaymentConditionImportCommerce(sendData);
export const tablePriceImportCommerce = new TablePriceImportCommerce(sendData);
export const billingLocationImportCommerce = new BillingLocationImportCommerce(
  sendData
);
export const billetImportCommerce = new BilletImportCommerce(sendData);
export const orderImportCommerce = new OrderImportCommerce(sendData);
