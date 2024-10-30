import { diffDates } from "../../../helpers/diffDates";
import { groupByObject } from "../../../helpers/groupByObject";
import { entities } from "../../../module/entities/useCases";
import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetOrderItems {
  sigemp: string;
  itemId: number;
  pedidoCod: number;
  pedidoAtualCod: number;
  posicaoCodPedidoAtual: number;
  posicaoDescPedidoAtual: string;
  posicaoDetalhadaCodPedidoAtual: number;
  posicaoDetalhadaDescPedidoAtual: string;
  posicaoDetalhadaCod: number;
  posicaoDetalhadaDescicao: string;
  posicaoCod: number;
  posicaoDescricao: string;
  clienteCod: number;
  vlrTotalMercadoria: string;
  vlrNota: string;
  vlrIcmsSt: string;
  dtFaturamento: Date;
  dtEntrada: Date;
  formaPagamento: string;
  especieCod: number;
  transportadoraCod: number;
  produtoCod: number;
  itemPosition: string;
  itemQtd: string;
  vlrLiquido: string;
  vlrUnitario: string;
  marcaCod: number;
  origemMercadoriaCod: number;
  recusaCod: number;
  recusaDescicao: string;
  sequencia: number;
  produtoDescricao: string;
  produtoDescricaoComplementar: string;
  produtoReferencia: string;
  unidadeEstoque: string;
  dtFaturamentoPedidoAtual: Date;
  gradeCod: number;
  gradeDescricao: string;
  corUmDescricao: string;
  corDoisDescricao: string;
  ncm?: number;
  origemCod?: number;
  origemDescricao: string;
  dtAlteracao: Date;
}

interface Order {
  initialsOrder?: string;
  orderCod: number;
  clientCod: number;
  sellerCod: number;
  agentCod?: number;
  brandCod: number;
  shippingCod: number;
  valueST?: number;
  noteValue: number;
  merchandiseValue: number;
  deliveryDate: Date;
  billingDate?: Date;
  paymentCondition?: string;
  keyNfe?: string;
  position: string;
  detailPosition: string;
  species?: number;
  originCod: number | undefined;
  originDesc: string | undefined;
  products: ProductOrder[];
}

interface ProductOrder {
  id: string;
  cod: number;

  currentOrderCod: number;
  currentOrderDetailPosition: string;
  currentInvoiceDate: Date;

  description: string;
  position: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryCodColor?: string;
  secondaryCodColor?: string;
  ncm?: number;
  codGrid?: number;
  grid?: string;
  reference: string;
  quantity?: number;
  sequence: number;
  value: number;
  total: number;
  measuredUnit?: string;
  cancellationReason?: string;
  cancellationReasonCod?: number;
  refuseCod: number | undefined;
  refuse: string | undefined;
  documentNumber: string | undefined;
  highlighterTag: string[];
  origin: string;
}

export class OrderViewImportPortal {
  readonly pageSize = 1000;
  constructor(private sendData: SendData) {}

  async onNormalized(itemsOrder: GetOrderItems[]): Promise<Order[]> {
    const groupOrders = groupByObject(itemsOrder, (item) => item.pedidoCod);

    let normalizedOrders: Order[] = [];

    for (const orderGroup of groupOrders) {
      const order = orderGroup.data[0];

      const productsOrder = await this.onNormalizedOrderProduct(
        orderGroup.data
      );
      const orderNormalized = await this.onNormalizedOrder(
        order,
        productsOrder
      );
      normalizedOrders.push(orderNormalized);
    }

    return normalizedOrders;
  }

  async onNormalizedOrder(
    order: GetOrderItems,
    itemsOrder: ProductOrder[]
  ): Promise<Order | null> {
    const detailPosition = this.getDetailPositionOrder(itemsOrder);

    const representanteResponse = await dbSiger.$ExecuteQuery<{
      representanteCod: number;
    }>(`
      select rep.representanteCod 
      from 01010s005.dev_pedido_rep rep 
      where rep.pedidoCod = ${order.pedidoCod} and rep.tipoRep = 1 
      limit 1
    `);

    const prepostoResponse = await dbSiger.$ExecuteQuery<{
      representanteCod: number;
    }>(`
      select rep.representanteCod 
      from 01010s005.dev_pedido_rep rep 
      where rep.pedidoCod = ${order.pedidoCod} and rep.tipoRep = 2
      limit 1
    `);

    return {
      detailPosition,
      sellerCod: representanteResponse?.[0]?.representanteCod ?? 0,
      agentCod: prepostoResponse?.[0]?.representanteCod ?? 0,
      orderCod: Number(order.pedidoCod),
      initialsOrder: order.sigemp,
      position: order.posicaoDescricao,
      clientCod: order.clienteCod,
      brandCod: order.marcaCod,
      shippingCod: order.transportadoraCod,
      deliveryDate: order.dtEntrada,
      billingDate: order.dtFaturamento,
      paymentCondition: order.formaPagamento,
      species: order.especieCod,
      originCod: order.origemCod,
      originDesc: order.origemDescricao,
      merchandiseValue: itemsOrder.reduce(
        (previousValue, currentValue) => currentValue.total + previousValue,
        0
      ),
      products: itemsOrder,

      // Setar no item valores abaixo
      // valueST: order.vlrIcmsSt ? Number(order.vlrIcmsSt) : undefined,
      noteValue: itemsOrder.reduce(
        (previousValue, currentValue) => currentValue.total + previousValue,
        0
      ),
    };
  }

  async onNormalizedOrderProduct(
    items: GetOrderItems[]
  ): Promise<ProductOrder[]> {
    return Promise.all(
      items.map(async (itemOrder) => {
        const currentOrderDetailPosition =
          Number(itemOrder.posicaoDetalhadaCodPedidoAtual) === 5
            ? itemOrder.posicaoDescPedidoAtual
            : itemOrder.posicaoDetalhadaDescPedidoAtual;

        let documentNumber = undefined;
        if (["faturado"].includes(currentOrderDetailPosition.toLowerCase())) {
          const getInvoice = await dbSiger.$ExecuteQuery<{
            numeroNota: number;
          }>(`
              select  n.numeroNota
              from 01010s005.dev_pedido_nota n 
              where n.pedidoCod = ${itemOrder.pedidoAtualCod} 
              limit 1
            `);

          documentNumber = getInvoice?.[0]?.numeroNota
            ? String(getInvoice[0].numeroNota)
            : undefined;
        }

        const motivoCancelamentoResponse = await dbSiger.$ExecuteQuery<{
          motivo: number;
          descricao: string;
        }>(`
          select c.motivo,c.descricao
          from 01010s005.dev_pedido_motivo_cancelamento c 
          where c.pedidoCod = ${itemOrder.pedidoAtualCod} 
          limit 1
        `);

        let highlighterTag: string[] = [];

        if (itemOrder?.especieCod !== 9) {
          var regularExpressionHighlighter = /\[([^\]]+)\]/;
          const highlighter = await entities.highlightersOrder.findAll({
            fields: {
              pedidoCod: true,
              txtObs: true,
            },
            search: `dp.pedidoCod in (${itemOrder.pedidoAtualCod})`,
          });

          if (highlighter.length > 0) {
            highlighter.forEach((item) => {
              const highlighterNormalized = regularExpressionHighlighter?.exec(
                item.txtObs
              )?.[1];

              if (highlighterNormalized) {
                highlighterTag.push(highlighterNormalized);
              }
            });
          }
        }

        return {
          id: String(itemOrder.itemId),
          cod: itemOrder.produtoCod,
          currentOrderCod: Number(itemOrder.pedidoAtualCod),
          sequence: itemOrder.sequencia,
          description: itemOrder.produtoDescricao,
          position:
            currentOrderDetailPosition.toLocaleLowerCase() === "recusado"
              ? "Recusado"
              : itemOrder.itemPosition === "Nada faturado"
              ? "Aguardando Faturamento"
              : itemOrder.itemPosition,
          primaryColor: itemOrder.corUmDescricao ?? "-",
          secondaryColor: itemOrder.corDoisDescricao,
          reference: itemOrder.produtoReferencia,
          quantity: Number(itemOrder.itemQtd),
          codGrid: itemOrder.gradeCod,
          grid: itemOrder.gradeDescricao,
          measuredUnit: itemOrder.unidadeEstoque,
          value: Number(itemOrder.vlrUnitario),
          total: Number(itemOrder.vlrLiquido),
          ncm: Number(itemOrder?.ncm),
          currentOrderDetailPosition,
          documentNumber,
          refuse: itemOrder.recusaDescicao || undefined,
          refuseCod: itemOrder.recusaCod || undefined,
          cancellationReasonCod:
            motivoCancelamentoResponse?.[0]?.motivo || undefined,
          cancellationReason:
            motivoCancelamentoResponse?.[0]?.descricao || undefined,
          highlighterTag,
          currentInvoiceDate: new Date(itemOrder.dtFaturamentoPedidoAtual),
          origin: [1, 2].includes(itemOrder.origemMercadoriaCod)
            ? "Importado"
            : "Nacional",
        };
      })
    );
  }

  getDetailPositionOrder(
    itemsOrder: ProductOrder[]
  ):
    | "Faturado"
    | "Parcialmente faturado"
    | "Recusado"
    | "Bloqueado"
    | "Cancelado" {
    const totalLength = itemsOrder.length;

    const listFilterFaturado = itemsOrder.filter(
      (item) => item.position.toLowerCase() === "faturado"
    );
    const listFilterNadaFaturado = itemsOrder.filter(
      (item) => item.position.toLowerCase() === "aguardando faturamento"
    );
    const listFilterCancelado = itemsOrder.filter(
      (item) => item.position.toLowerCase() === "cancelado"
    );
    const listFilterRecusado = itemsOrder.filter(
      (item) => item.currentOrderDetailPosition.toLowerCase() === "recusado"
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
      return "Parcialmente faturado";
    }

    if (listFilterFaturado.length > 0 && listFilterNadaFaturado.length <= 0) {
      return "Faturado";
    }

    return "Bloqueado";
  }

  async SendOrder(itemsOrder: GetOrderItems[]) {
    const normalizedOrders = await this.onNormalized(itemsOrder);

    await this.sendData.post("/order/importV2", normalizedOrders);
  }

  async execute({ search }: { search?: string }) {
    try {
      const whereNormalized = search ? `where ${search}` : ``;

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `select count(*) as total  from 01010s005.dev_pedido_v2 p
            inner join 01010s005.dev_pedido_item i on i.nossoNumeroPedido = p.codigo
            ${whereNormalized}
            `
          )
        )[0].total
      );

      const totalPedidos = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `select count(*) as total from (
              select count(*) as total from 01010s005.dev_pedido_v2 p
              inner join 01010s005.dev_pedido_item i on p.codigo = i.nossoNumeroPedido
             ${whereNormalized}
              group by p.codigo 
            ) as anality`
          )
        )[0].total
      );

      const totalPage = Math.ceil(totalPedidos / this.pageSize);

      const startDate = new Date();

      for (let index = 0; index < totalPage; index++) {
        try {
          const limit = this.pageSize;
          const offset = this.pageSize * index;

          const listOrdersCod = await dbSiger.$ExecuteQuery<{
            codigo: number;
          }>(`
            select p.codigo from 01010s005.dev_pedido_v2 p
            inner join 01010s005.dev_pedido_item i on p.codigo = i.nossoNumeroPedido
            ${whereNormalized}
            group by p.codigo 
            order by p.codigo desc
            limit ${limit}
            offset ${offset}
          `);

          const itemsOrder = await dbSiger.$ExecuteQuery<GetOrderItems>(
            `
            select 
              p.sigemp,
              i.nossoNumeroPedido as pedidoCod,
	            i.pedidoCod as pedidoAtualCod, 
              p.posicaoDetalhadaCod,
              p.posicaoCod,
              p.posicaoDescricao,
              p.posicaoDetalhadaDescicao,
              p.clienteCod,
              p.vlrTotalMercadoria,
              p.vlrNota,
              p.dtFaturamento,
              p.dtEntrada,
              p.formaPagamento,
              p.especieCod,
              p.transportadoraCod,
              
              i.id as itemId,
              i.produtoCod,
              i.sequencia,
              i.posicao as itemPosition,
              i.qtd as itemQtd,
              i.vlrLiquido,
              i.vlrUnitario as vlrUnitario,
              i.corUmDescricao as "corUmDescricao",
              i.corDoisDescricao as "corDoisDescricao",
              i.marcaCod,
              i.ncm,
              i.produtoDescricao as "produtoDescricao",
              i.produtoDescricaoComplementar as "produtoDescricaoComplementar",
              i.produtoReferencia,
              i.gradeCod as gradeCod,i.gradeDescricao as gradeDescricao,
              i.unidadeEstoque as unidadeEstoque,
              i.origemMercadoriaCod,

              i.recusaCod,i.recusaDescicao,
              i.origemCod,i.origemDescricao,
              i.posicaoCodPedidoAtual,i.posicaoDescPedidoAtual,
              i.posicaoDetalhadaCodPedidoAtual,i.posicaoDetalhadaDescPedidoAtual,
              i.dtFaturamento as "dtFaturamentoPedidoAtual",

              i.dtAlteracao
                
            from 01010s005.dev_pedido_item i
            inner join 01010s005.dev_pedido_v2 p on p.codigo = i.nossoNumeroPedido and p.sigemp = i.sigemp
              
            where  p.codigo in (${listOrdersCod
              .map((item) => item.codigo)
              .join(",")});
            `
          );

          await this.SendOrder(itemsOrder);
          console.log(`${index + 1} de ${totalPage}`);
        } catch (error) {
          console.log(error);
        }
      }

      const endDate = new Date();

      console.log(`Pedido 045`);
      console.log(`-> Total pedidos: ${totalPedidos}`);
      console.log(`-> Total itens: ${totalItems}`);
      console.log("-> " + (await diffDates(startDate, endDate)));
    } catch (error) {
      console.log(error);
    }
  }
}
