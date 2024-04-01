import type { queue as queueFastq } from "fastq";
import * as fastq from "fastq";
import { worker } from "./worker";

const CONCURRENCY = 4;

export type Task = {
  search?: string;
  entity:
    | "ocViewImportPortal"
    | "walletSellerClientsViewImportPortal"
    | "highlighterViewImportPortal"
    | "registerGroupViewImportPortal"
    | "conceptViewImportPortal"
    | "billetViewImportPortal"
    | "brandViewImportPortal"
    | "clientViewImportPortal"
    | "orderViewImportPortal"
    | "brandsToSellerViewImportPortal"
    | "eanViewImportPortal"
    | "gridViewImportPortal"
    | "sellerViewImportPortal"
    | "noteOrderViewImportPortal"
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
    | "tablePriceImportCommerce";
};

export const queue: queueFastq<Task> = fastq(worker, CONCURRENCY);
