import { diffDates } from "../../../helpers/diffDates";
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

export interface ProductRecibe {
  codigo: number;
}

export interface ItemsRecibe {
  produtoCod: number;
  qtd: number;
  dtFaturamento: string;
}

export interface reserveRecibe {
  produtoCod: number;
  qtd: number;
  dtEntrega: string;
}

export interface PurchaseRecibe {
  produtoCod: number;
  periodo: string;
  qtd: string;
}

export class StockFutureCommerce {
  readonly size = 500;

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

  async onNormalizedStock(productsRecibe: ProductRecibe[]) {
    const accumulatedStocks: StockLocationNormalized[] = [];

    const now = new Date();
    const periodMonth = ("00" + String(now.getMonth() + 1)).slice(-2);
    const periodYear = now.getFullYear();

    const periodNow = `${periodMonth}-${periodYear}`;

    for (const product of productsRecibe) {
      const purchases = await this.getPurchases({
        productCod: product.codigo,
      });
      accumulatedStocks.push(
        ...purchases.map((purchase) => ({
          period: purchase.periodo,
          name: this.normalizedPeriodName(purchase.periodo),
          productCod: purchase.produtoCod,
          qtd: Math.trunc(Number(purchase.qtd)),
          date: this.normalizedPeriodDate(purchase.periodo),
        }))
      );

      const items = await this.getItems({
        productCod: product.codigo,
      });

      for (const item of items) {
        const reserves = await this.getReserves({
          productCod: product.codigo,
          period: item.dtFaturamento,
        });

        const qtdAvailable = item.qtd - reserves;

        const findOne = accumulatedStocks.find(
          (f) =>
            f.productCod === item.produtoCod && f.period === item.dtFaturamento
        );

        if (findOne) {
          findOne.qtd = findOne.qtd - qtdAvailable;
        } else {
          accumulatedStocks.push({
            period: item.dtFaturamento,
            name: this.normalizedPeriodName(item.dtFaturamento),
            productCod: item.produtoCod,
            qtd: Math.trunc(qtdAvailable * -1),
            date: this.normalizedPeriodDate(item.dtFaturamento),
          });
        }
      }

      const findNowStock = accumulatedStocks.find(
        (f) => f.productCod === product.codigo && f.period === periodNow
      );

      const periodNowAccumulatedStocks = {
        period: periodNow,
        name: this.normalizedPeriodName(periodNow),
        productCod: product.codigo,
        qtd: 0,
        date: this.normalizedPeriodDate(periodNow),
      };

      for (const stock of accumulatedStocks) {
        if (findNowStock) {
          if (stock.date < findNowStock.date) {
            findNowStock.qtd = findNowStock.qtd + stock.qtd;
            stock.qtd = 0;
          }
        } else {
          if (stock.date < periodNowAccumulatedStocks.date) {
            periodNowAccumulatedStocks.qtd =
              periodNowAccumulatedStocks.qtd + stock.qtd;
            stock.qtd = 0;
          }
        }
      }

      if (!findNowStock) accumulatedStocks.push(periodNowAccumulatedStocks);
    }

    return accumulatedStocks;
  }

  async getItems({ productCod }: { productCod: number }) {
    const itemsResponse = await dbSiger.$ExecuteQuery<ItemsRecibe>(`
      select 
        i.produtoCod, 
        TO_CHAR(i.dtFaturamento,'MM-YYYY') as dtFaturamento, 
        sum(i.qtd ) as qtd
      from 01010s005.dev_pedido_item_v2 i
      where 
        i.produtoCod in (${productCod}) and 
        i.posicaoCod = 1
      group by i.produtoCod, TO_CHAR(i.dtFaturamento,'MM-YYYY');
    `);

    return itemsResponse;
  }

  async getReserves({
    productCod,
    period,
  }: {
    productCod: number;
    period: string;
  }) {
    const itemsResponse = await dbSiger.$ExecuteQuery<reserveRecibe>(`
      select 
        r.produtoCod, 
        TO_CHAR(r.dtEntrega,'MM-YYYY') as dtEntrega, 
        sum(r.qtdReservada ) as qtd
      from 01010s005.dev_item_reserva r
      where 
        r.produtoCod in (${productCod}) and
        TO_CHAR(r.dtEntrega,'MM-YYYY') in ('${period}')
      group by r.produtoCod, TO_CHAR(r.dtEntrega,'MM-YYYY');
    `);

    return itemsResponse.reduce((accumulator, currentValue) => {
      const convertNumber = Number(currentValue.qtd);
      return accumulator + convertNumber;
    }, 0);
  }

  async getPurchases({ productCod }: { productCod: number }) {
    const productsResponse = await dbSiger.$ExecuteQuery<PurchaseRecibe>(`
    select  
      m.produtoCod, 
      TO_CHAR(m.periodo,'MM-YYYY') as periodo, 
      SUM(m.qtdAberto) as qtd
    from 01010s005.dev_metas m 
    where 
      m.produtoCod in (${productCod})
    group by produtoCod, TO_CHAR(m.periodo,'MM-YYYY')
    ;
  `);

    return productsResponse;
  }

  async getProducts({
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

    const productsResponse = await dbSiger.$ExecuteQuery<ProductRecibe>(`
    select  
      p.codigo
    FROM 01010s005.dev_produto p
    ${search}
    limit ${limit}
    offset ${offset}
    ;
  `);

    return await this.onNormalizedStock(productsResponse);
  }

  async getProductsTotal({ search }: { search: string }) {
    const productsTotal = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
          select count(*) as total
          FROM 01010s005.dev_produto p
          ${search}
      `
        )
      )[0].total
    );

    return productsTotal;
  }

  async execute({ search }: ExecuteServiceProps) {
    const query = search ? `where ${search}` : ``;

    const startDate = new Date();

    const totalProducts = await this.getProductsTotal({ search: query });
    const totalPages = Math.ceil(totalProducts / this.size);

    console.log("-> Produtos " + totalProducts);
    console.log("-> Paginas " + totalPages);

    for (let index = 0; index < totalPages; index++) {
      const page = index;

      console.log(`${page + 1} de ${totalPages}`);

      const stocks = await this.getProducts({
        search: query,
        page: page,
        pagesize: this.size,
      });

      if (stocks.length > 0)
        await this.sendData.post("/stock-locations/import", stocks);
    }

    const endDate = new Date();

    console.log("-> " + (await diffDates(startDate, endDate)));
  }
}
