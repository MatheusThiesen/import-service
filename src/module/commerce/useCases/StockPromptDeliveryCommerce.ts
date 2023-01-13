import { AccumulatedStock } from "src/module/entities/model/AccumulatedStock";
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
  readonly size = 1000;

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

  private onNormalizedStock(accumulatedStocks: AccumulatedStock[]) {
    return accumulatedStocks.map((item) => ({
      period: "pronta-entrega",
      name: "Pronta Entrega",
      productCod: item.product.code,
      qtd: Math.trunc(item.physicalQuantity - item.reservedQuantity),
    }));
  }

  async execute({ search }: ExecuteServiceProps) {
    const query = `product.situation IN (2) ${search ? `AND ${search}` : ""}`;
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
      isPagination: true,
      page: 0,
      size: this.size,
    });

    await this.sendData.post(
      "/stock-locations/import",
      this.onNormalizedStock(accumulatedStocks.content)
    );

    const totalPages = Number(accumulatedStocks.totalPages);

    for (let index = 0; index < totalPages; index++) {
      const page = index + 1;

      console.log(`accumulated-stocks  ${page} de ${totalPages}`);

      const accumulatedStocksResponse =
        await this.accumulatedStockRepository.getAll({
          fields: {
            period: true,
            physicalQuantity: true,
            reservedQuantity: true,
            product: {
              code: true,
            },
          },
          search: `${query} AND period EQ ${currentDate} AND stockLocation.code IN (20,50) `,
          isPagination: true,
          page: page,
          size: this.size,
        });

      await this.sendData.post(
        "/stock-locations/import",
        this.onNormalizedStock(accumulatedStocksResponse.content)
      );
    }
  }
}
