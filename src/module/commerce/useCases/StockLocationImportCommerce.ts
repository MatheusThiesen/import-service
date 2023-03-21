import { groupByObject } from "../../../helpers/groupByObject";
import { IAccumulatedStockRepository } from "../../../module/entities/repositories/types/IAccumulatedStockRepository";
import { IOrderItemRepository } from "../../../module/entities/repositories/types/IOrderItemRepository";
import { IPurchaseOrderItemsRepository } from "../../../module/entities/repositories/types/IPurchaseOrderItemsRepository";
import { dbSiger } from "../../../service/dbSiger";
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
    private readonly orderItemRepository: IOrderItemRepository
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

    const dateMonthLong = new Date(`${day}/${month}/${year}`).toLocaleString(
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
    const whereNormalized = query ? `where ${query}` : ``;

    const estoqueResponse = await dbSiger.$ExecuteQuery<{
      produtoCod: number;
      qtdLivre: number;
    }>(`
        select pe.produtoCod, (SUM(pe.qtdFisica) - SUM(pe.qtdReservada)) AS qtdLivre
        from 01010s005.DEV_ESTOQUE_PRONTA_ENTREGA pe 
        ${whereNormalized}
        group by pe.produtoCod
    `);

    return estoqueResponse.map((item) => ({
      period: "pronta-entrega",
      name: "Pronta Entrega",
      productCod: item.produtoCod,
      qtd: item.qtdLivre,
    }));
  }
  private async getLocaleFuture(
    query: string
  ): Promise<StockLocationNormalized[]> {
    var localesFuture: StockLocationNormalized[] = [];

    const purchaseOrderItems = (
      await this.purchaseOrderItemsRepository.getAll({
        fields: {
          deliveryDeadlineDate: true,
          requestedQuantity: true,
          product: {
            code: true,
          },
        },
        search: `${query} AND itemStatus EQ 2 stockLocation.code EQ 20`,
      })
    ).content;

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

        const orderItems = (
          await this.orderItemRepository.getAll({
            fields: {
              quantity: true,
            },
            search: `product.code EQ ${productCod} AND positionItem IN (1,3) AND deliveryDate EQ "${period}"`,
          })
        ).content;

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

    const purchaseOrderItems = (
      await this.purchaseOrderItemsRepository.getAll({
        fields: {
          deliveryDeadlineDate: true,
          requestedQuantity: true,
          product: {
            code: true,
          },
        },
        search: `${query} AND itemStatus EQ 2 AND stockLocation.code EQ 20`,
        //  AND deliveryDeadlineDate GT "${currentDate}"
      })
    ).content;

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
    const query = `
      (pe.qtdFisica - pe.qtdReservada) > 0
      `;

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
