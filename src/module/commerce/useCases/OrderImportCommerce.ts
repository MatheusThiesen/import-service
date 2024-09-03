import { dbSiger } from "../../../service/dbSiger";
import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

type GetOrderProps = {
  codigo: number;
  dtFaturamento: Date;
  vlrTotalMercadoria: Date;
  id: number;
  produtoCod: number;
  sequencia: number;
  vlrUnitario: string;
  qtd: number;
  posicao: string;
  situacao: string;
  recusa: number;
  recusaDescricao: string;
  cancelamento: number;
  cancelamentoDescricao: string;
};

export class OrderImportCommerce {
  readonly pagesize = 800;

  constructor(private sendData: SendDataRepository) {}

  getDetailPositionOrder(itemsOrder: GetOrderProps[]):
    | "Faturado"
    // | "Parcialmente faturado"
    | "Recusado"
    | "Bloqueado"
    | "Cancelado" {
    const totalLength = itemsOrder.length;

    const listFilterFaturado = itemsOrder.filter(
      (item) => item.posicao.toLowerCase() === "faturado"
    );
    const listFilterNadaFaturado = itemsOrder.filter(
      (item) => item.posicao.toLowerCase() === "nada faturado"
    );
    const listFilterCancelado = itemsOrder.filter(
      (item) => item.posicao.toLowerCase() === "cancelado"
    );
    const listFilterRecusado = itemsOrder.filter(
      (item) => item.situacao.toLowerCase() === "recusado"
    );

    if (listFilterRecusado.length >= 1) {
      return "Recusado";
    }

    if (totalLength === listFilterFaturado.length) {
      return "Faturado";
    }

    if (totalLength === listFilterCancelado.length) {
      return "Cancelado";
    }

    if (totalLength === listFilterNadaFaturado.length) {
      return "Bloqueado";
    }

    if (listFilterFaturado.length > 0 && listFilterNadaFaturado.length > 0) {
      return "Bloqueado";
      // return "Parcialmente faturado";
    }

    if (listFilterFaturado.length > 0 && listFilterNadaFaturado.length <= 0) {
      return "Faturado";
    }

    return "Bloqueado";
  }

  async normalized(codigo: number) {
    const getItensOrder = await dbSiger.$ExecuteQuery<GetOrderProps>(`
      select 
        p.codigo,
        p.dtFaturamento,
        p.vlrTotalMercadoria,
        i.id,
        i.produtoCod, 
        i.sequencia, 
        i.vlrUnitario,
        i.qtd,
        i.posicao,
        CASE 
          WHEN i.posicaoDetalhadaCodPedidoAtual = 5 
          THEN i.posicaoDescPedidoAtual 
          ELSE i.posicaoDetalhadaDescPedidoAtual 
        END AS "situacao",
        i.recusaCod as "recusa",
        i.recusaDescicao as "recusaDescricao",
        c.motivo as "cancelamento",
        c.descricao as "cancelamentoDescricao" 
      from 01010s005.dev_pedido p
      inner join 01010s005.dev_pedido_item i on p.codigo = i.nossoNumeroPedido 
      left join 01010s005.dev_pedido_motivo_cancelamento c on c.itemId = i.id
      where  p.codigo = ${codigo};
    `);

    return getItensOrder.map((item) => ({
      codigo: item.codigo,
      dtFaturamento: item.dtFaturamento,
      vlrTotalMercadoria: Number(item.vlrTotalMercadoria),
      id: String(item.id),
      produtoCod: item.produtoCod,
      sequencia: item.sequencia,
      vlrUnitario: Number(item.vlrUnitario),
      qtd: Number(item.qtd),
      posicao: item.posicao,
      situacao: this.getDetailPositionOrder(getItensOrder).toLowerCase(),
      recusa: item.recusa ? item.recusa : undefined,
      recusaDescricao: item.recusaDescricao ? item.recusaDescricao : undefined,
      cancelamento: item.cancelamento ? item.cancelamento : undefined,
      cancelamentoDescricao: item.cancelamentoDescricao
        ? item.cancelamentoDescricao
        : undefined,
    }));
  }

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = search;

      const totalItems = await entities.order.count({ search: query });
      const totalPages = Math.ceil(totalItems / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const orders = await entities.order.findAll({
          fields: {
            codigo: true,
          },
          search,
          page: page,
          pagesize: this.pagesize,
        });

        for (const order of orders) {
          const normalized = await this.normalized(order.codigo);

          await this.sendData.post(
            "/orders/import",

            normalized
          );
        }
      }
    } catch (error) {
      console.log(error);
      console.log("[ORDERS][ERRO]");
    }
  }
}
