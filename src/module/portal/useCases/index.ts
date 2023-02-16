// import { AuthorizationRepository } from "../repositories/Authorization";
import { AuthorizationRepository } from "../repositories/Authorization";
import { SendData } from "../repositories/SendData";
import { BilletViewImportPortal } from "./BilletViewImportPortal";
import { BrandViewImportPortal } from "./BrandViewImportPortal";
import { ClientViewImportPortal } from "./ClientViewImportPortal";
import { OrderViewImportPortal } from "./OrderViewImportPortal";
import { SellerViewImportPortal } from "./SellerViewImportPortal";

export const authorization = new AuthorizationRepository();
export const sendData = new SendData(authorization);
// export const productImportPortal = new ProductImportPortal(sendData);
// export const orderImportPortal = new OrderImportPortal(sendData);
// export const gridImportPortal = new GridImportPortal(sendData);
export const orderViewImportPortal = new OrderViewImportPortal(sendData);
export const brandViewImportPortal = new BrandViewImportPortal(sendData);
export const sellerViewImportPortal = new SellerViewImportPortal(sendData);
export const clientViewImportPortal = new ClientViewImportPortal(sendData);
export const billetViewImportPortal = new BilletViewImportPortal(sendData);
