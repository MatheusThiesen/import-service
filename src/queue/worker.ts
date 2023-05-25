import "dotenv/config";

import { done } from "fastq";
import {
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
  productImageImportCommerce,
  productImportCommerce,
  sellerImportCommerce,
  stockFutureCommerce,
  stockPromptDeliveryCommerce,
  subGroupImportCommerce,
  walletSellerClientImportCommerce,
} from "../module/commerce/useCases";
import {
  billetViewImportPortal,
  brandViewImportPortal,
  brandsToSellerViewImportPortal,
  clientViewImportPortal,
  eanViewImportPortal,
  gridViewImportPortal,
  noteOrderViewImportPortal,
  orderViewImportPortal,
  sellerViewImportPortal,
} from "../module/portal/useCases";

import { Task } from "./";

export async function worker(arg: Task, cb: done) {
  switch (arg.entity) {
    case "orderViewImportPortal":
      await orderViewImportPortal.execute({ search: arg.search });
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
    case "noteOrderViewImportPortal":
      await noteOrderViewImportPortal.execute({ search: arg.search });
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
  }

  cb(null);
}
