import type { queue as queueFastq } from "fastq";
import * as fastq from "fastq";
import { worker } from "./worker";

const CONCURRENCY = 6;

export type Task = {
  search?: string;
  entity:
    | "suspendedInvoiceViewImportPortal"
    | "serviceInvoiceViewImportPortal"
    | "groupsProductToSellerViewImportPortal"
    | "groupProductViewImportPortal"
    | "accessSellerNextdataViewImportPortal"
    | "orderNotInternalCodeViewImportPortal"
    | "orderViewImportPortal"
    | "orderNotInternalCodeViewImportPortalOnly018"
    | "orderViewImportPortalOnly018"
    | "ocViewImportPortal"
    | "walletSellerClientsViewImportPortal"
    | "highlighterViewImportPortal"
    | "registerGroupViewImportPortal"
    | "conceptViewImportPortal"
    | "billetViewImportPortal"
    | "brandViewImportPortal"
    | "clientViewImportPortal"
    | "brandsToSellerViewImportPortal"
    | "eanViewImportPortal"
    | "gridViewImportPortal"
    | "sellerViewImportPortal"
    | "productImportCommerce"
    | "brandImportCommerce"
    | "collectionImportCommerce"
    | "colorImportCommerce"
    | "groupImportCommerce"
    | "subGroupImportCommerce"
    | "lineImportCommerce"
    | "listPriceImportCommerce"
    | "brandsToSellerImportCommerce"
    | "sellerImportCommerce"
    | "conceptImportCommerce"
    | "stockPromptDeliveryCommerce"
    | "stockFutureCommerce"
    | "branchActivistsImportCommerce"
    | "clientImportCommerce"
    | "productImageImportCommerce"
    | "walletSellerClientImportCommerce"
    | "paymentConditionImportCommerce"
    | "billingLocationImportCommerce"
    | "billetImportCommerce"
    | "orderImportCommerce"
    | "blockGroupProductToSellerImportCommerce"
    | "tablePriceImportCommerce";
};

export const queue: queueFastq<Task> = fastq(worker, CONCURRENCY);
