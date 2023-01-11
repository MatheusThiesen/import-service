import { AuthorizationRepository } from "../../../module/commerce/repositories/AuthorizationRepository";
import { SendDataRepository } from "../../../module/commerce/repositories/SendDataRepository";
import { Concepts } from "../entities/concepts";
import { ProductConceptRules } from "../entities/productConceptRules";
import { Products } from "../entities/products";
import { Observable } from "./observable";
import { SendData } from "./sendData";

const authorization = new AuthorizationRepository();
export const sendDataApi = new SendDataRepository(authorization);
export const sendData = new SendData(sendDataApi);
export const observable = new Observable();

export const products = new Products(observable, sendData);
export const concepts = new Concepts(observable, sendData);
export const productConceptRules = new ProductConceptRules(
  observable,
  sendData
);
