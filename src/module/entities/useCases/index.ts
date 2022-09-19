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
import { ColorRepository } from "./../repositories/ColorRepository";
import { OrderItemRepository } from "./../repositories/OrderItemRepository";
import { ProductCollectionRepository } from "./../repositories/ProductCollectionRepository";
import { Entities } from "./Entities";

export const customer = new CustomerRepository();
export const representative = new RepresentativeRepository();
export const payment = new PaymentRepository();
export const financialDocument = new FinancialDocumentRepository();
export const product = new ProductRepository();
export const grid = new GridRepository();
export const productLine = new ProductLineRepository();
export const productCollection = new ProductCollectionRepository();
export const color = new ColorRepository();
export const brand = new BrandRepository();
export const productGroup = new ProductGroupRepository();
export const productSubgroup = new ProductSubgroupRepository();
export const order = new OrderRepository();
export const orderItem = new OrderItemRepository();

export const entities = new Entities(
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
  orderItem
).execute();
