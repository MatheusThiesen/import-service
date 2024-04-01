// import { AuthorizationRepository } from "../repositories/Authorization";
import { AuthorizationRepository } from "../repositories/Authorization";
import { SendData } from "../repositories/SendData";
import { ServerPortal } from "./ApiPortal";
import { BilletViewImportPortal } from "./BilletViewImportPortal";
import { BrandViewImportPortal } from "./BrandViewImportPortal";
import { BrandsToSellerViewImportPortal } from "./BrandsToSellerViewImportPortal";
import { ClientViewImportPortal } from "./ClientViewImportPortal";
import { ConceptViewImportPortal } from "./ConceptViewImportPortal";
import { EanViewImportPortal } from "./EanViewImportPortal";
import { GridViewImportPortal } from "./GridViewImportPortal";
import { HighlighterViewImportPortal } from "./HighlighterViewImportPortal";
import { NoteOrderViewImportPortal } from "./NoteOrderViewImportPortal";
import { OcViewImportPortal } from "./OcViewImportPortal";
import { OrderViewImportPortal } from "./OrderViewImportPortal";
import { RegisterGroupViewImportPortal } from "./RegisterGroupViewImportPortal";
import { SellerViewImportPortal } from "./SellerViewImportPortal";
import { WalletSellerClientsViewImportPortal } from "./WalletSellerClientsViewImportPortal";

export const authorization = new AuthorizationRepository();
export const sendData = new SendData(authorization);
export const orderViewImportPortal = new OrderViewImportPortal(sendData);
export const eanViewImportPortal = new EanViewImportPortal(sendData);
export const gridViewImportPortal = new GridViewImportPortal(sendData);
export const brandViewImportPortal = new BrandViewImportPortal(sendData);
export const sellerViewImportPortal = new SellerViewImportPortal(sendData);
export const clientViewImportPortal = new ClientViewImportPortal(sendData);
export const billetViewImportPortal = new BilletViewImportPortal(sendData);
export const conceptViewImportPortal = new ConceptViewImportPortal(sendData);
export const ocViewImportPortal = new OcViewImportPortal(sendData);
export const noteOrderViewImportPortal = new NoteOrderViewImportPortal(
  sendData
);
export const brandsToSellerViewImportPortal =
  new BrandsToSellerViewImportPortal(sendData);
export const registerGroupViewImportPortal = new RegisterGroupViewImportPortal(
  sendData
);
export const highlighterViewImportPortal = new HighlighterViewImportPortal(
  sendData
);
export const walletSellerClientsViewImportPortal =
  new WalletSellerClientsViewImportPortal(sendData);

export const serverPortal = new ServerPortal();
