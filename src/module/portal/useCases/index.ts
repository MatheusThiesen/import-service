import { AuthorizationRepository } from "./Authorization";
import { OrderImportPortal } from "./OrderImportPortal";
import { ProductImportPortal } from "./ProductImportPortal";
import { SendData } from "./SendData";

export const authorization = new AuthorizationRepository();
export const sendData = new SendData(authorization);
export const productImportPortal = new ProductImportPortal(sendData);
export const orderImportPortal = new OrderImportPortal(sendData);
