import "dotenv/config";

import { done } from "fastq";
import {
  billetViewImportPortal,
  brandsToSellerViewImportPortal,
  brandViewImportPortal,
  clientViewImportPortal,
  eanViewImportPortal,
  gridViewImportPortal,
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
  }

  cb(null);
}
