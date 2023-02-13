// import { AuthorizationRepository } from "../repositories/Authorization";
import { AuthorizationRepository } from "../repositories/Authorization";
import { SendData } from "../repositories/SendData";
import { OrderViewImportPortal } from "./OrderViewImportPortal";

export const authorization = new AuthorizationRepository();
export const sendData = new SendData(authorization);
// export const productImportPortal = new ProductImportPortal(sendData);
// export const orderImportPortal = new OrderImportPortal(sendData);
// export const gridImportPortal = new GridImportPortal(sendData);
export const orderViewImportPortal = new OrderViewImportPortal(sendData);
