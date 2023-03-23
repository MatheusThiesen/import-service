import { dbSiger } from "../../../service/dbSiger";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export interface StockLocationNormalized {
  period: string;
  name: string;
  productCod: number;
  qtd: number;
}

export interface StockRecibe {
  produtoCod: number;
  qtdLivre: number;
}

export class StockPromptDeliveryCommerce {
  readonly size = 5000;

  constructor(private sendData: SendDataRepository) {}

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

  private onNormalizedStock(accumulatedStocks: StockRecibe[]) {
    return accumulatedStocks.map((item) => ({
      period: "pronta-entrega",
      name: "Pronta Entrega",
      productCod: item.produtoCod,
      qtd: Math.trunc(item.qtdLivre),
    }));
  }

  async getStocks({
    search,
    page,
    pagesize,
  }: {
    search: string;
    page: number;
    pagesize: number;
  }) {
    const limit = pagesize;
    const offset = pagesize * page;

    const productsResponse = await dbSiger.$ExecuteQuery<StockRecibe>(`
      select 
        pe.produtoCod,
        (SUM(pe.qtdFisica) - SUM(pe.qtdReservada)) AS qtdLivre
      from 01010s005.DEV_ESTOQUE_PRONTA_ENTREGA pe 
      ${search}
      group by pe.produtoCod
      limit ${limit}
      offset ${offset}
      ;
    `);

    return this.onNormalizedStock(productsResponse);
  }

  async getStocksTotal({ search }: { search: string }) {
    const stocksTotal = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
          select count(*) as total from (
            select (count(*) - count(*) + 1) as "total"
            from 01010s005.DEV_ESTOQUE_PRONTA_ENTREGA pe 
            ${search}
            group by pe.produtoCod
          )  as analytics;
      `
        )
      )[0].total
    );

    return stocksTotal;
  }

  async execute({ search }: ExecuteServiceProps) {
    const query = search ? `where ${search}` : ``;
    const totalPages = await this.getStocksTotal({ search: query });

    for (let index = 0; index < totalPages; index++) {
      const page = index;

      const stocks = await this.getStocks({
        search: query,
        page: page,
        pagesize: this.size,
      });

      await this.sendData.post("/stock-locations/import", stocks);
    }
  }
}
