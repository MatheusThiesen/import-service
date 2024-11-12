import "dotenv/config";

import { done } from "fastq";
import {
  billetImportCommerce,
  billingLocationImportCommerce,
  blockGroupProductToSellerImportCommerce,
  branchActivistsImportCommerce,
  brandImportCommerce,
  brandsToSellerImportCommerce,
  clientImportCommerce,
  collectionImportCommerce,
  colorImportCommerce,
  conceptImportCommerce,
  groupImportCommerce,
  lineImportCommerce,
  listPriceImportCommerce,
  orderImportCommerce,
  paymentConditionImportCommerce,
  productImageImportCommerce,
  productImportCommerce,
  sellerImportCommerce,
  stockFutureCommerce,
  stockPromptDeliveryCommerce,
  subGroupImportCommerce,
  tablePriceImportCommerce,
  walletSellerClientImportCommerce,
} from "../module/commerce/useCases";
import {
  accessSellerNextdataViewImportPortal,
  billetViewImportPortal,
  brandViewImportPortal,
  brandsToSellerViewImportPortal,
  clientViewImportPortal,
  conceptViewImportPortal,
  eanViewImportPortal,
  gridViewImportPortal,
  groupProductViewImportPortal,
  groupsProductToSellerViewImportPortal,
  highlighterViewImportPortal,
  ocViewImportPortal,
  orderNotInternalCodeViewImportPortal,
  orderNotInternalCodeViewImportPortalOnly018,
  orderViewImportPortal,
  orderViewImportPortalOnly018,
  registerGroupViewImportPortal,
  sellerViewImportPortal,
  serviceInvoiceViewImportPortal,
  walletSellerClientsViewImportPortal,
} from "../module/portal/useCases";

import { Task } from "./";

export async function worker(arg: Task, cb: done) {
  switch (arg.entity) {
    case "serviceInvoiceViewImportPortal":
      await serviceInvoiceViewImportPortal.execute({
        search: arg.search,
      });
      break;
    case "groupsProductToSellerViewImportPortal":
      await groupsProductToSellerViewImportPortal.execute({
        search: arg.search,
      });
      break;
    case "groupProductViewImportPortal":
      await groupProductViewImportPortal.execute({
        search: arg.search,
      });
      break;
    case "accessSellerNextdataViewImportPortal":
      await accessSellerNextdataViewImportPortal.execute({
        search: arg.search,
      });
      break;
    case "ocViewImportPortal":
      await ocViewImportPortal.execute({ search: arg.search });
      break;
    case "walletSellerClientsViewImportPortal":
      await walletSellerClientsViewImportPortal.execute({ search: arg.search });
      break;
    case "highlighterViewImportPortal":
      await highlighterViewImportPortal.execute({ search: arg.search });
      break;
    case "registerGroupViewImportPortal":
      await registerGroupViewImportPortal.execute({ search: arg.search });
      break;
    case "conceptViewImportPortal":
      await conceptViewImportPortal.execute({ search: arg.search });
      break;
    case "orderViewImportPortal":
      await orderViewImportPortal.execute({ search: arg.search });
      break;
    case "orderNotInternalCodeViewImportPortal":
      await orderNotInternalCodeViewImportPortal.execute({
        search: arg.search,
      });
      break;
    case "orderViewImportPortalOnly018":
      await orderViewImportPortalOnly018.execute({ search: arg.search });
      break;
    case "orderNotInternalCodeViewImportPortalOnly018":
      await orderNotInternalCodeViewImportPortalOnly018.execute({
        search: arg.search,
      });
      break;
    case "billetViewImportPortal":
      await billetViewImportPortal.execute({ search: arg.search });
      break;
    case "brandViewImportPortal":
      await brandViewImportPortal.execute({ search: arg.search });
      break;
    case "clientViewImportPortal":
      await clientViewImportPortal.execute({ search: arg.search });
      break;
    case "sellerViewImportPortal":
      await sellerViewImportPortal.execute({ search: arg.search });
      break;
    case "brandsToSellerViewImportPortal":
      await brandsToSellerViewImportPortal.execute({ search: arg.search });
      break;
    case "eanViewImportPortal":
      await eanViewImportPortal.execute({ search: arg.search });
      break;
    case "gridViewImportPortal":
      await gridViewImportPortal.execute({ search: arg.search });
      break;
    case "productImportCommerce":
      await productImportCommerce.execute({ search: arg.search });
      break;
    case "brandImportCommerce":
      await brandImportCommerce.execute({ search: arg.search });
      break;
    case "collectionImportCommerce":
      await collectionImportCommerce.execute({ search: arg.search });
      break;
    case "colorImportCommerce":
      await colorImportCommerce.execute({ search: arg.search });
      break;
    case "groupImportCommerce":
      await groupImportCommerce.execute({ search: arg.search });
      break;
    case "lineImportCommerce":
      await lineImportCommerce.execute({ search: arg.search });
      break;
    case "listPriceImportCommerce":
      await listPriceImportCommerce.execute({ search: arg.search });
      break;
    case "brandsToSellerImportCommerce":
      await brandsToSellerImportCommerce.execute({ search: arg.search });
      break;
    case "sellerImportCommerce":
      await sellerImportCommerce.execute({ search: arg.search });
      break;
    case "stockPromptDeliveryCommerce":
      await stockPromptDeliveryCommerce.execute({ search: arg.search });
      break;
    case "conceptImportCommerce":
      await conceptImportCommerce.execute({ search: arg.search });
      break;
    case "subGroupImportCommerce":
      await subGroupImportCommerce.execute({ search: arg.search });
      break;
    case "stockFutureCommerce":
      await stockFutureCommerce.execute({ search: arg.search });
      break;
    case "branchActivistsImportCommerce":
      await branchActivistsImportCommerce.execute({ search: arg.search });
      break;
    case "clientImportCommerce":
      await clientImportCommerce.execute({ search: arg.search });
      break;
    case "walletSellerClientImportCommerce":
      await walletSellerClientImportCommerce.execute({ search: arg.search });
      break;
    case "productImageImportCommerce":
      await productImageImportCommerce.execute({ search: arg.search });
      break;
    case "paymentConditionImportCommerce":
      await paymentConditionImportCommerce.execute({ search: arg.search });
      break;
    case "tablePriceImportCommerce":
      await tablePriceImportCommerce.execute({ search: arg.search });
      break;
    case "billingLocationImportCommerce":
      await billingLocationImportCommerce.execute({ search: arg.search });
      break;
    case "billetImportCommerce":
      await billetImportCommerce.execute({ search: arg.search });
      break;
    case "orderImportCommerce":
      await orderImportCommerce.execute({ search: arg.search });
      break;
    case "blockGroupProductToSellerImportCommerce":
      await blockGroupProductToSellerImportCommerce.execute({
        search: arg.search,
      });
      break;
  }

  cb(null);
}
