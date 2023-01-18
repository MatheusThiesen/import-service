import { AuthorizationRepository } from "../../../module/commerce/repositories/AuthorizationRepository";
import { SendDataRepository } from "../../../module/commerce/repositories/SendDataRepository";
import { BrandsToSeller } from "../entities/brandsToSeller";
import { Concepts } from "../entities/concepts";
import { OrdersItems } from "../entities/ordersItems";
import { ProductConceptRules } from "../entities/productConceptRules";
import { Products } from "../entities/products";
import { PurchasesOrder } from "../entities/purchasesOrder";
import { Sellers } from "../entities/sellers";
import { StocksPromptDelivery } from "../entities/stocksPromptDelivery";
import { Observable } from "./observable";
import { SendData } from "./sendData";

const authorization = new AuthorizationRepository();
export const sendDataApi = new SendDataRepository(authorization);
export const sendData = new SendData(sendDataApi);
export const observable = new Observable();

export const products = new Products(observable, sendData);
export const ordersItems = new OrdersItems(observable, sendData);
export const concepts = new Concepts(observable, sendData);
export const purchasesOrder = new PurchasesOrder(observable, sendData);
export const sellers = new Sellers(observable, sendData);
export const brandsToSeller = new BrandsToSeller(observable, sendData);
export const stocksPromptDelivery = new StocksPromptDelivery(
  observable,
  sendData
);
export const productConceptRules = new ProductConceptRules(
  observable,
  sendData
);
