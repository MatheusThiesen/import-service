import { IBrandRepository } from "../repositories/types/IBrandRepository";
import { IColorRepository } from "../repositories/types/IColorRepository";
import { ICustomerRepository } from "../repositories/types/ICustomerRepository";
import { IFinancialDocumentRepository } from "../repositories/types/IFinancialDocumentRepository";
import { IGridRepository } from "../repositories/types/IGridRepository";
import { IOrderItemRepository } from "../repositories/types/IOrderItemRepository";
import { IPaymentRepository } from "../repositories/types/IPaymentRepository";
import { IProductCollectionRepository } from "../repositories/types/IProductCollectionRepository";
import { IProductLineRepository } from "../repositories/types/IProductLineRepository";
import { IProductRepository } from "../repositories/types/IProductRepository";
import { IProductSubgroupRepository } from "../repositories/types/IProductSubgroupRepository";
import { IRepresentativeRepository } from "../repositories/types/IRepresentativeRepository";
import { IAccumulatedStockRepository } from "./../repositories/types/IAccumulatedStockRepository";
import { IOrderRepository } from "./../repositories/types/IOrderRepository";
import { IProductGroupRepository } from "./../repositories/types/IProductGroupRepository";
import { IPurchaseOrderItemsRepository } from "./../repositories/types/IPurchaseOrderItemsRepository";

export class Entities {
  constructor(
    private customer: ICustomerRepository,
    private financialDocument: IFinancialDocumentRepository,
    private grid: IGridRepository,
    private payment: IPaymentRepository,
    private product: IProductRepository,
    private representative: IRepresentativeRepository,
    private productLine: IProductLineRepository,
    private productCollection: IProductCollectionRepository,
    private colorRepository: IColorRepository,
    private brandRepository: IBrandRepository,
    private productGroupRepository: IProductGroupRepository,
    private productSubgroupRepository: IProductSubgroupRepository,
    private orderRepository: IOrderRepository,
    private orderItemRepository: IOrderItemRepository,
    private purchaseOrderItemsRepository: IPurchaseOrderItemsRepository,
    private accumulatedStockRepository: IAccumulatedStockRepository
  ) {}

  execute() {
    return {
      customer: this.customer,
      financialDocument: this.financialDocument,
      grid: this.grid,
      payment: this.payment,
      product: this.product,
      representative: this.representative,
      productLine: this.productLine,
      productCollection: this.productCollection,
      color: this.colorRepository,
      brand: this.brandRepository,
      productGroup: this.productGroupRepository,
      productSubgroup: this.productSubgroupRepository,
      order: this.orderRepository,
      orderItem: this.orderItemRepository,
      purchaseOrderItems: this.purchaseOrderItemsRepository,
      accumulatedStock: this.accumulatedStockRepository,
    };
  }
}
