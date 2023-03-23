import { dbSiger } from "../../../service/dbSiger";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export interface StockLocationNormalized {
  period: string;
  name: string;
  productCod: number;
  qtd: number;
  date: Date;
}

export interface ItemsRecibe {
  produtoCod: number;
  qtd: number;
  dtFaturamento: string;
}

export interface PurchaseRecibe {
  produtoCod: number;
  periodo: string;
  qtd: string;
}

export class StockFutureCommerce {
  readonly size = 5000;

  constructor(private sendData: SendDataRepository) {}

  private normalizedPeriodName(datePeriod: string) {
    const [month, year] = datePeriod.split("-");

    const date = new Date(`${year}/${month}/01`);
    const dateMonthLong = date.toLocaleString("pt-br", {
      month: "long",
    });

    return `${
      dateMonthLong[0].toUpperCase() + dateMonthLong.substring(1)
    } ${year}`;
  }
  private normalizedPeriodDate(datePeriod: string) {
    const [month, year] = datePeriod.split("-");

    const date = new Date(`${year}/${month}/01`);
    return date;
  }

  async onNormalizedStock(purchasesRecibe: PurchaseRecibe[]) {
    const accumulatedStocks: StockLocationNormalized[] = [];

    for (const purchase of purchasesRecibe) {
      const items = await this.getItems({
        productCod: purchase.produtoCod,
        period: purchase.periodo,
      });

      accumulatedStocks.push({
        period: purchase.periodo,
        name: this.normalizedPeriodName(purchase.periodo),
        productCod: purchase.produtoCod,
        qtd: Math.trunc(Number(purchase.qtd) - items),
        date: this.normalizedPeriodDate(purchase.periodo),
      });
    }

    return accumulatedStocks;
  }

  async getItems({
    productCod,
    period,
  }: {
    productCod: number;
    period: string;
  }) {
    const itemsResponse = await dbSiger.$ExecuteQuery<ItemsRecibe>(`
      select 
        i.produtoCod, 
        TO_CHAR(i.dtFaturamento,'MM-YYYY') as dtFaturamento, 
        sum(i.qtd) as qtd
      from 01010s005.dev_pedido_item_v2 i 
      where i.posicaoCod in (1,3) and 
            i.produtoCod in (${productCod}) and 
            TO_CHAR(i.dtFaturamento,'MM-YYYY') in ('${period}')
      group by i.produtoCod, TO_CHAR(i.dtFaturamento,'MM-YYYY')
      ;
    `);

    return itemsResponse.reduce(
      (accumulator, currentValue) => accumulator + currentValue.qtd,
      0
    );
  }

  async getPurchases({
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

    const productsResponse = await dbSiger.$ExecuteQuery<PurchaseRecibe>(`
    select  m.produtoCod, 
        TO_CHAR(m.periodo,'MM-YYYY') as periodo, 
        SUM(m.qtdAberto) as qtd
    from 01010s005.dev_metas m 
    ${search}
    group by produtoCod, TO_CHAR(m.periodo,'MM-YYYY')
    limit ${limit}
    offset ${offset}
    ;
  `);

    return await this.onNormalizedStock(productsResponse);
  }

  async getPurchasesTotal({ search }: { search: string }) {
    const stocksTotal = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
          select count(*) as total
          from (
            select  m.produtoCod
            from 01010s005.dev_metas m 
            ${search}
            group by produtoCod, TO_CHAR(m.periodo,'MM-YYYY')
          ) as metas
      `
        )
      )[0].total
    );

    return stocksTotal;
  }

  async execute({ search }: ExecuteServiceProps) {
    const query = search ? `where ${search}` : ``;

    const totalPages = await this.getPurchasesTotal({ search: query });

    for (let index = 0; index < totalPages; index++) {
      const page = index;

      const stocks = await this.getPurchases({
        search: query,
        page: page,
        pagesize: this.size,
      });

      await this.sendData.post("/stock-locations/import", stocks);
    }
  }
}
