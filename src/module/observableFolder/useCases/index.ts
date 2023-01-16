import { AuthorizationRepository } from "../../../module/commerce/repositories/AuthorizationRepository";
import { SendDataRepository } from "../../../module/commerce/repositories/SendDataRepository";
import { Concepts } from "../entities/concepts";
import { ProductConceptRules } from "../entities/productConceptRules";
import { Products } from "../entities/products";
import { PurchasesOrder } from "../entities/purchasesOrder";
import { StocksPromptDelivery } from "../entities/stocksPromptDelivery";
import { Observable } from "./observable";
import { SendData } from "./sendData";

const authorization = new AuthorizationRepository();
export const sendDataApi = new SendDataRepository(authorization);
export const sendData = new SendData(sendDataApi);
export const observable = new Observable();

export const products = new Products(observable, sendData);
export const concepts = new Concepts(observable, sendData);
export const purchasesOrder = new PurchasesOrder(observable, sendData);
export const stocksPromptDelivery = new StocksPromptDelivery(
  observable,
  sendData
);
export const productConceptRules = new ProductConceptRules(
  observable,
  sendData
);
