// import { AuthorizationRepository } from "../repositories/Authorization";
import { AuthorizationRepository } from "../repositories/Authorization";
import { SendData } from "../repositories/SendData";
import { ServerPortal } from "./ApiPortal";
import { BilletViewImportPortal } from "./BilletViewImportPortal";
import { BrandsToSellerViewImportPortal } from "./BrandsToSellerViewImportPortal";
import { BrandViewImportPortal } from "./BrandViewImportPortal";
import { ClientViewImportPortal } from "./ClientViewImportPortal";
import { EanViewImportPortal } from "./EanViewImportPortal";
import { GridViewImportPortal } from "./GridViewImportPortal";
import { OrderViewImportPortal } from "./OrderViewImportPortal";
import { SellerViewImportPortal } from "./SellerViewImportPortal";

export const authorization = new AuthorizationRepository();
export const sendData = new SendData(authorization);
export const orderViewImportPortal = new OrderViewImportPortal(sendData);
export const eanViewImportPortal = new EanViewImportPortal(sendData);
export const gridViewImportPortal = new GridViewImportPortal(sendData);
export const brandViewImportPortal = new BrandViewImportPortal(sendData);
export const sellerViewImportPortal = new SellerViewImportPortal(sendData);
export const clientViewImportPortal = new ClientViewImportPortal(sendData);
export const billetViewImportPortal = new BilletViewImportPortal(sendData);
export const brandsToSellerViewImportPortal =
  new BrandsToSellerViewImportPortal(sendData);

export const serverPortal = new ServerPortal();
