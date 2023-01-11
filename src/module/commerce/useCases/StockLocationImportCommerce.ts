import { groupByObject } from "../../../helpers/groupByObject";
import { IAccumulatedStockRepository } from "../../../module/entities/repositories/types/IAccumulatedStockRepository";
import { IOrderItemRepository } from "../../../module/entities/repositories/types/IOrderItemRepository";
import { IProductRepository } from "../../../module/entities/repositories/types/IProductRepository";
import { IPurchaseOrderItemsRepository } from "../../../module/entities/repositories/types/IPurchaseOrderItemsRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";

export interface StockLocationNormalized {
  period: string;
  name: string;
  productCod: number;
  qtd: number;
}

export class StockLocationImportCommerce {
  constructor(
    private sendData: SendDataRepository,
    private readonly purchaseOrderItemsRepository: IPurchaseOrderItemsRepository,
    private readonly accumulatedStockRepository: IAccumulatedStockRepository,
    private readonly orderItemRepository: IOrderItemRepository,
    private readonly productRepository: IProductRepository
  ) {}

  private async getCurrentDate({
    type,
  }: {
    type: "period" | "deliveryDeadlineDate";
  }) {
    const nowYear = new Date().toLocaleString("pt-br", { year: "numeric" });
    const nowMonth = new Date().toLocaleString("pt-br", {
      month: type === "period" ? "2-digit" : "numeric",
    });

    if (type === "period") {
      return `${nowYear}${nowMonth}`;
    } else {
      return `01/${+nowMonth + 1}/${nowYear}`;
    }
  }
  private normalizedMonth(datePeriod: string, type: "period" | "name") {
    const [day, month, year] = datePeriod.split("/");

    const dateMonthLong = new Date(`${month}/${day}/${year}`).toLocaleString(
      "pt-br",
      {
        month: "long",
      }
    );

    if (type === "period") {
      return `${month}-${year}`;
    } else {
      return `${
        dateMonthLong[0].toUpperCase() + dateMonthLong.substring(1)
      } ${year}`;
    }
  }

  private async getPromptDelivery(
    query: string
  ): Promise<StockLocationNormalized[]> {
    const currentDate = await this.getCurrentDate({ type: "period" });

    const accumulatedStocks = await this.accumulatedStockRepository.getAll({
      fields: {
        period: true,
        physicalQuantity: true,
        reservedQuantity: true,
        product: {
          code: true,
        },
      },
      search: `${query} AND period EQ ${currentDate} AND stockLocation.code IN (20,50) `,
    });

    return accumulatedStocks.map((item) => ({
      period: "pronta-entrega",
      name: "Pronta Entrega",
      productCod: item.product.code,
      qtd: item.physicalQuantity - item.reservedQuantity,
    }));
  }
  private async getLocaleFuture(
    query: string
  ): Promise<StockLocationNormalized[]> {
    var localesFuture: StockLocationNormalized[] = [];

    const purchaseOrderItems = await this.purchaseOrderItemsRepository.getAll({
      fields: {
        deliveryDeadlineDate: true,
        requestedQuantity: true,
        product: {
          code: true,
        },
      },
      search: `${query} AND itemStatus EQ 2 stockLocation.code EQ 20`,
    });

    for (const groupProduct of groupByObject(
      purchaseOrderItems,
      (i) => i.product.code
    )) {
      const productCod = groupProduct.value as number;

      for (const groupDeliveryDate of groupByObject(
        groupProduct.data,
        (i) => i.deliveryDeadlineDate
      )) {
        const period = groupDeliveryDate.value as string;
        const requestedQuantity = groupDeliveryDate.data.reduce(
          (acc, data) => acc + data.requestedQuantity,
          0
        );

        const orderItems = await this.orderItemRepository.getAll({
          fields: {
            quantity: true,
          },
          search: `product.code EQ ${productCod} AND positionItem IN (1,3) AND deliveryDate EQ "${period}"`,
        });

        const reservedItems = orderItems.reduce(
          (acc, data) => acc + data.quantity,
          0
        );

        localesFuture.push({
          period: this.normalizedMonth(period, "period"),
          name: this.normalizedMonth(period, "name"),
          productCod: productCod,
          qtd: requestedQuantity - reservedItems,
        });
      }
    }

    return localesFuture;
  }
  private async getLocaleFutureAvailableTarget(
    query: string
  ): Promise<StockLocationNormalized[]> {
    var localesFuture: StockLocationNormalized[] = [];

    const purchaseOrderItems = await this.purchaseOrderItemsRepository.getAll({
      fields: {
        deliveryDeadlineDate: true,
        requestedQuantity: true,
        product: {
          code: true,
        },
      },
      search: `${query} AND itemStatus EQ 2 AND stockLocation.code EQ 20`,
      //  AND deliveryDeadlineDate GT "${currentDate}"
    });

    for (const groupProduct of groupByObject(
      purchaseOrderItems,
      (i) => i.product.code
    )) {
      const productCod = groupProduct.value as number;

      for (const groupDeliveryDate of groupByObject(
        groupProduct.data,
        (i) => i.deliveryDeadlineDate
      )) {
        const period = groupDeliveryDate.value as string;
        const requestedQuantity = groupDeliveryDate.data.reduce(
          (acc, data) => acc + data.requestedQuantity,
          0
        );

        localesFuture.push({
          period: this.normalizedMonth(period, "period"),
          name: this.normalizedMonth(period, "name"),
          productCod: productCod,
          qtd: requestedQuantity,
        });
      }
    }

    return localesFuture;
  }

  async execute() {
    // 2 NIKE - 233 COLEÇÃO NIKE
    // 10 ADIDAS - 66 COLEÇÃO ADIDAS
    // 23 LACOSTE - 48 COLEÇÃO LACOSTE
    // 400 US POLO

    const query = `
      product.situation IN (2)
      `;
    // const query = `product.brand.code IN (400) AND product.situation IN (2)`;

    const promptDelivery = await this.getPromptDelivery(query);
    // const localeFuture = await this.getLocaleFuture(query);
    // const localeFutureAvailableTarget =
    //   await this.getLocaleFutureAvailableTarget(query);

    const stockLocations: StockLocationNormalized[] = [
      ...promptDelivery,
      // ...localeFuture,
      // ...localeFutureAvailableTarget,
    ];

    await this.sendData.post("/stock-locations/import", stockLocations);
  }
}
