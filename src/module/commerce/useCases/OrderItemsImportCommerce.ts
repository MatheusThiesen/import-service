import { IOrderItemRepository } from "src/module/entities/repositories/types/IOrderItemRepository";
import { dbSiger } from "../../../service/dbSiger";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface OrderItemRecibe {
  itemId: number;
  produtoCod: number;
  pedidoCod: number;
  posicaoItemCod: number;
  dtFaturamento: Date;
  sequencia: number;
  qtd: number;
  vlrLiquido: number;
  vlrUnitario: number;
}

interface OrderItemNormalized {
  cod: string;
  qtd: number;
  value: number;
  valueTotal: number;
  status: number;
  pedidoCodigo: number;
  produtoCodigo: number;
}

export class OrderItemImportCommerce {
  readonly pagesize = 1000;

  constructor(
    private sendData: SendDataRepository,
    private readonly orderItemRepository: IOrderItemRepository
  ) {}

  onOrderItemNormalized(ordersItems: OrderItemRecibe[]): OrderItemNormalized[] {
    return ordersItems.map((item) => ({
      cod: item.itemId.toString(),
      pedidoCodigo: item.pedidoCod,
      produtoCodigo: item.produtoCod,
      dataFaturmaneto: item.dtFaturamento,
      status: item.posicaoItemCod,
      qtd: item.qtd,
      value: item.vlrUnitario,
      valueTotal: item.vlrLiquido,
      sequencia: item.sequencia,
    }));
  }

  async getOrderItems({
    search,
    page,
    pagesize,
  }: {
    search: string;
    page: number;
    pagesize: number;
  }) {
    const whereNormalized = search ? `where ${search}` : ``;
    const limit = pagesize;
    const offset = pagesize * page;

    const itemsResponse = await dbSiger.$ExecuteQuery<OrderItemRecibe>(`
      select  
        i.id as itemId,
		    i.produtoCod,
        i.pedidoCod,
        i.posicaoCod as posicaoItemCod,
        p.dtFaturamento,
        i.sequencia,
        i.qtd,
  		  i.vlrLiquido,
        i.vlrUnitario as vlrUnitario
      from 01010s005.dev_pedido_item_v2 i
      inner join 01010s005.dev_pedido_v2 p on p.codigo = i.pedidoCod
      ${whereNormalized}
      limit ${limit}
      offset ${offset}
      ;
    `);

    return this.onOrderItemNormalized(itemsResponse);
  }

  async getTotalOrder({ search }: { search: string }) {
    const whereNormalized = search ? `where ${search}` : ``;

    const totalPedidos = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
          select  
            count(*) as total
          from 01010s005.dev_pedido_item_v2 i
          inner join 01010s005.dev_pedido_v2 p on p.codigo = i.pedidoCod
          ${whereNormalized}
          ;
      `
        )
      )[0].total
    );

    return totalPedidos;
  }

  async execute({ search }: ExecuteServiceProps) {
    const totalPages = await this.getTotalOrder({ search });

    for (let index = 0; index < totalPages; index++) {
      const page = index;

      const orderItems = await this.getOrderItems({
        search: search,
        page: page,
        pagesize: this.pagesize,
      });

      console.log(`orderItems  ${page} de ${totalPages}`);

      await this.sendData.post("/order-items/import", orderItems);
    }
  }
}
