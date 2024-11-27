// import { AuthorizationRepository } from "../repositories/Authorization";
import { AuthorizationRepository } from "../repositories/Authorization";
import { SendData } from "../repositories/SendData";
import { AccessSellerNextdataViewImportPortal } from "./AccessSellerNextdataViewImportPortal";
import { ServerPortal } from "./ApiPortal";
import { BilletViewImportPortal } from "./BilletViewImportPortal";
import { BrandViewImportPortal } from "./BrandViewImportPortal";
import { BrandsToSellerViewImportPortal } from "./BrandsToSellerViewImportPortal";
import { ClientViewImportPortal } from "./ClientViewImportPortal";
import { ConceptViewImportPortal } from "./ConceptViewImportPortal";
import { EanViewImportPortal } from "./EanViewImportPortal";
import { GridViewImportPortal } from "./GridViewImportPortal";
import { GroupProductViewImportPortal } from "./GroupProductViewImportPortal";
import { GroupsProductToSellerViewImportPortal } from "./GroupsProductToSellerViewImportPortal";
import { HighlighterViewImportPortal } from "./HighlighterViewImportPortal";
import { OcViewImportPortal } from "./OcViewImportPortal";
import { OrderNotInternalCodeViewImportPortal } from "./OrderNotInternalCodeViewImportPortal";
import { OrderNotInternalCodeViewImportPortalOnly018 } from "./OrderNotInternalCodeViewImportPortalOnly018";
import { OrderViewImportPortal } from "./OrderViewImportPortal";
import { OrderViewImportPortalOnly018 } from "./OrderViewImportPortalOnly018";
import { RegisterGroupViewImportPortal } from "./RegisterGroupViewImportPortal";
import { SellerViewImportPortal } from "./SellerViewImportPortal";
import { ServiceInvoiceViewImportPortal } from "./ServiceInvoiceViewImportPortal";
import { SuspendedInvoiceViewImportPortal } from "./SuspendedInvoiceViewImportPortal";
import { WalletSellerClientsViewImportPortal } from "./WalletSellerClientsViewImportPortal";

export const authorization = new AuthorizationRepository();
export const sendData = new SendData(authorization);
export const orderViewImportPortal = new OrderViewImportPortal(sendData);
export const orderNotInternalCodeViewImportPortal =
  new OrderNotInternalCodeViewImportPortal(sendData);
export const orderViewImportPortalOnly018 = new OrderViewImportPortalOnly018(
  sendData
);
export const orderNotInternalCodeViewImportPortalOnly018 =
  new OrderNotInternalCodeViewImportPortalOnly018(sendData);
export const eanViewImportPortal = new EanViewImportPortal(sendData);
export const gridViewImportPortal = new GridViewImportPortal(sendData);
export const brandViewImportPortal = new BrandViewImportPortal(sendData);
export const sellerViewImportPortal = new SellerViewImportPortal(sendData);
export const clientViewImportPortal = new ClientViewImportPortal(sendData);
export const billetViewImportPortal = new BilletViewImportPortal(sendData);
export const conceptViewImportPortal = new ConceptViewImportPortal(sendData);
export const serviceInvoiceViewImportPortal =
  new ServiceInvoiceViewImportPortal(sendData, authorization);
export const ocViewImportPortal = new OcViewImportPortal(sendData);
export const groupProductViewImportPortal = new GroupProductViewImportPortal(
  sendData
);
export const groupsProductToSellerViewImportPortal =
  new GroupsProductToSellerViewImportPortal(sendData);
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
export const suspendedInvoiceViewImportPortal =
  new SuspendedInvoiceViewImportPortal(sendData);

export const accessSellerNextdataViewImportPortal: AccessSellerNextdataViewImportPortal =
  new AccessSellerNextdataViewImportPortal(sendData);

export const serverPortal = new ServerPortal();
