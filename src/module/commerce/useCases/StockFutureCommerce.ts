import * as dayjs from "dayjs";
import { Quotas, QuotasFields } from "src/module/entities/model/Quotas";
import { entities } from "../../../module/entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export interface StockLocationNormalized {
  period: string;
  name: string;
  productCod: number;
  qtd: number;
  date: Date;
}

export interface StockRecibe {
  produtoCod: number;
  saldo: number;
  dtInicial: Date;
}

export class StockFutureCommerce {
  readonly size = 2000;

  constructor(private sendData: SendDataRepository) {}

  private normalizedPeriodName(date: Date) {
    const dateMonthLong = date.toLocaleString("pt-br", {
      month: "long",
    });

    return `${
      dateMonthLong[0].toUpperCase() + dateMonthLong.substring(1)
    } ${date.getFullYear()}`;
  }

  async onNormalizedStock(productsRecibe: StockRecibe[]) {
    const stockNormalized: StockLocationNormalized[] = productsRecibe.map(
      (item) => ({
        productCod: item.produtoCod,
        qtd: !isNaN(Number(item.saldo)) ? Number(item.saldo) : 0,
        date: item.dtInicial,
        name: this.normalizedPeriodName(item.dtInicial),
        period: dayjs(item.dtInicial).format("MM-YYYY"),
      })
    );

    return stockNormalized;
  }

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = search;

      const total = await entities.quotas.count({
        search: query,
      });
      const totalPages = Math.ceil(total / this.size);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const quotas = await entities.quotas.findAll<QuotasFields, Quotas>({
          fields: {
            dtInicial: true,
            produtoCod: true,
            saldo: true,
          },
          search: query,
          page: page,
          pagesize: this.size,
        });

        if (quotas.length > 0) {
          const stocks = await this.onNormalizedStock(quotas as StockRecibe[]);

          await this.sendData.post("/stock-locations/import", stocks);
        }
      }
    } catch (error) {
      console.log(error);
      console.log("[STOCK-FUTURE][ERRO]");
    }
  }
}
