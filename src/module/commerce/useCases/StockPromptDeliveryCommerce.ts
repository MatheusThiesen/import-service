import { IAccumulatedStockRepository } from "../../entities/repositories/types/IAccumulatedStockRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export interface StockLocationNormalized {
  period: string;
  name: string;
  productCod: number;
  qtd: number;
}

export class StockPromptDeliveryCommerce {
  constructor(
    private sendData: SendDataRepository,
    private readonly accumulatedStockRepository: IAccumulatedStockRepository
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

  async execute({ search }: ExecuteServiceProps) {
    const query = `product.situation IN (2) ${search ? `AND ${search}` : ""}`;

    const promptDelivery = await this.getPromptDelivery(query);

    await this.sendData.post("/stock-locations/import", promptDelivery);
  }
}
