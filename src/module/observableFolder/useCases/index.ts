import { AuthorizationRepository } from "../../../module/commerce/repositories/AuthorizationRepository";
import { SendDataRepository } from "../../../module/commerce/repositories/SendDataRepository";
import { Products } from "./products";

const authorization = new AuthorizationRepository();
export const sendData = new SendDataRepository(authorization);
export const products = new Products(sendData);
