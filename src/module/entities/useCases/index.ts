import { BrandRepository } from "../repositories/BrandRepository";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { FinancialDocumentRepository } from "../repositories/FinancialDocumentRepository";
import { GridRepository } from "../repositories/GridRepository";
import { OrderRepository } from "../repositories/OrderRepository";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { ProductGroupRepository } from "../repositories/ProductGroupRepository";
import { ProductLineRepository } from "../repositories/ProductLineRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { ProductSubgroupRepository } from "../repositories/ProductSubgroupRepository";
import { RepresentativeRepository } from "../repositories/RepresentativeRepository";
import { AccumulatedStockRepository } from "./../repositories/AccumulatedStockRepository";
import { ColorRepository } from "./../repositories/ColorRepository";
import { OrderItemRepository } from "./../repositories/OrderItemRepository";
import { ProductCollectionRepository } from "./../repositories/ProductCollectionRepository";
import { PurchaseOrderItemsRepository } from "./../repositories/PurchaseOrderItemsRepository";

import { GetListAll } from "../useCases/GetListAll";

const getListAll = new GetListAll();

export const customer = new CustomerRepository(getListAll);
export const representative = new RepresentativeRepository(getListAll);
export const payment = new PaymentRepository(getListAll);
export const financialDocument = new FinancialDocumentRepository(getListAll);
export const product = new ProductRepository(getListAll);
export const grid = new GridRepository(getListAll);
export const productLine = new ProductLineRepository(getListAll);
export const productCollection = new ProductCollectionRepository(getListAll);
export const color = new ColorRepository(getListAll);
export const brand = new BrandRepository(getListAll);
export const productGroup = new ProductGroupRepository(getListAll);
export const productSubgroup = new ProductSubgroupRepository(getListAll);
export const order = new OrderRepository(getListAll);
export const orderItem = new OrderItemRepository(getListAll);
export const purchaseOrderItems = new PurchaseOrderItemsRepository(getListAll);
export const accumulatedStock = new AccumulatedStockRepository(getListAll);

export const entities = {
  customer,
  financialDocument,
  grid,
  payment,
  product,
  representative,
  productLine,
  productCollection,
  color,
  brand,
  productGroup,
  productSubgroup,
  order,
  orderItem,
  purchaseOrderItems,
  accumulatedStock,
};
