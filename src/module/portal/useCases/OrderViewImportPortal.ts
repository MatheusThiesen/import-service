import { diffDates } from "../../../helpers/diffDates";
import { groupByObject } from "../../../helpers/groupByObject";
import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetOrderItems {
  sigemp: string;
  itemId: number;
  pedidoCod: number;
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
  recusaCod: number;
  recusaDescicao: string;
  sequencia: number;
  produtoDescricao: string;
  produtoDescricaoComplementar: string;
  produtoReferencia: string;
  produtoUnidadeEstoque: string;
  gradeCod: number;
  gradeDescricao: string;
  corUmDescricao: string;
  corDoisDescricao: string;
  // numeroNota: number;
  // serieNota: string;
  // representanteCod: number;
  // prepostoCod: number;
  dtAlteracao: Date;
}

interface SendOrder {
  initialsOrder?: string;
  orderCod: number;
  clientCod: number;
  sellerCod: number;
  agentCod?: number;
  brandCod: number;
  shippingCod: number;
  documentNumber: string;
  valueST?: number;
  noteValue: number;
  merchandiseValue: number;
  refuseCod?: number;
  refuse?: string;
  deliveryDate: Date;
  billingDate?: Date;
  paymentCondition?: string;
  position: string;
  detailPosition: string;
  species?: number;
  cancellationReason?: string;
  cancellationReasonCod?: number;
  products: {
    id: string;
    cod: Number;
    description: String;
    position: String;
    primaryColor?: String;
    secondaryColor?: String;
    primaryCodColor?: String;
    secondaryCodColor?: String;
    ncm?: number;
    codGrid?: number;
    grid?: String;
    reference: String;
    quantity?: Number;
    sequence: Number;
    value?: Number;
    measuredUnit?: String;
    cancellationReason?: string;
    cancellationReasonCod?: number;
  }[];
}

export class OrderViewImportPortal {
  readonly pageSize = 50000;
  constructor(private sendData: SendData) {}

  async onNormalizedOrder(itemsOrder: GetOrderItems[]): Promise<SendOrder[]> {
    const groupOrders = await groupByObject(
      itemsOrder,
      (item) => item.pedidoCod
    );

    let normalizedOrders: SendOrder[] = [];

    for (const orderGroup of groupOrders) {
      const representanteResponse = await dbSiger.$ExecuteQuery<{
        representanteCod: number;
      }>(`
        select rep.representanteCod 
        from 01010s005.dev_pedido_rep rep 
        where rep.pedidoCod = ${orderGroup.value} and rep.tipoRep = 1 
        limit 1
      `);

      const prepostoResponse = await dbSiger.$ExecuteQuery<{
        representanteCod: number;
      }>(`
        select rep.representanteCod 
        from 01010s005.dev_pedido_rep rep 
        where rep.pedidoCod = ${orderGroup.value} and rep.tipoRep = 2
        limit 1
      `);

      const numeroNotaResponse = await dbSiger.$ExecuteQuery<{
        numeroNota: number;
      }>(`
        select n.numeroNota
        from 01010s005.dev_pedido_nota n 
        where n.pedidoCod = ${orderGroup.value} 
        limit 1
      `);

      const motivoCancelamentoResponse = await dbSiger.$ExecuteQuery<{
        motivo: number;
        descricao: string;
      }>(`
        select c.motivo,c.descricao
        from 01010s005.dev_pedido_motivo_cancelamento c 
        where c.pedidoCod = ${orderGroup.value} 
        limit 1
      `);

      const sellerCod =
        representanteResponse &&
        representanteResponse[0] &&
        representanteResponse[0].representanteCod
          ? representanteResponse[0].representanteCod
          : 0;
      const agentCod =
        prepostoResponse &&
        prepostoResponse[0] &&
        prepostoResponse[0].representanteCod
          ? prepostoResponse[0].representanteCod
          : 0;
      const documentNumber =
        numeroNotaResponse &&
        numeroNotaResponse[0] &&
        numeroNotaResponse[0].numeroNota
          ? String(numeroNotaResponse[0].numeroNota)
          : "";

      const order = orderGroup.data[0];

      const detailPosition =
        Number(order.posicaoDetalhadaCod) === 5
          ? order.posicaoDescricao
          : order.posicaoDetalhadaDescicao;

      const createOrder: SendOrder = {
        orderCod: order.pedidoCod,
        clientCod: order.clienteCod,
        sellerCod,
        agentCod,
        brandCod: order.marcaCod,
        shippingCod: order.transportadoraCod,
        initialsOrder: order.sigemp,
        valueST: order.vlrIcmsSt ? Number(order.vlrIcmsSt) : undefined,
        noteValue: Number(order.vlrNota),
        merchandiseValue: Number(order.vlrTotalMercadoria),
        deliveryDate: order.dtEntrada,
        billingDate: order.dtFaturamento,
        paymentCondition: order.formaPagamento,
        refuse: order.recusaDescicao,
        refuseCod: order.recusaCod,
        cancellationReasonCod: motivoCancelamentoResponse[0]
          ? motivoCancelamentoResponse[0].motivo
          : undefined,
        cancellationReason: motivoCancelamentoResponse[0]
          ? motivoCancelamentoResponse[0].descricao
          : undefined,
        documentNumber,
        detailPosition,
        position: order.posicaoDescricao,
        products: [],
      };
      orderGroup.value;
      for (const itemOrder of orderGroup.data) {
        createOrder.products.push({
          id: String(itemOrder.itemId),
          cod: itemOrder.produtoCod,
          sequence: itemOrder.sequencia,
          description: itemOrder.produtoDescricao,
          position: itemOrder.itemPosition,
          primaryColor: itemOrder.corUmDescricao ?? "-",
          secondaryColor: itemOrder.corDoisDescricao,
          reference: itemOrder.produtoReferencia,
          quantity: Number(itemOrder.itemQtd),
          codGrid: itemOrder.gradeCod,
          grid: itemOrder.gradeDescricao,
          measuredUnit: itemOrder.produtoUnidadeEstoque,
          value: Number(itemOrder.vlrUnitario),
        });
      }

      normalizedOrders.push(createOrder);
    }

    return normalizedOrders;
  }

  async sendOrder(itemsOrder: GetOrderItems[]) {
    const normalizedOrders = await this.onNormalizedOrder(itemsOrder);

    await this.sendData.post("/order/importV2", normalizedOrders);
  }

  async execute({ search }: { search?: string }) {
    try {
      const whereNormalized = search ? `where ${search}` : ``;

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
        select count(*) as total from 01010s005.dev_pedido_v2 p
          inner join 01010s005.dev_pedido_item_v2 i on p.codigo = i.pedidoCod 
        ${whereNormalized};
        `
          )
        )[0].total
      );

      const totalPedidos = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
        select count(*) as total from 01010s005.dev_pedido_v2 p
          
        ${whereNormalized};
        `
          )
        )[0].total
      );

      const totalPage = Math.ceil(totalItems / this.pageSize);

      const startDate = new Date();

      for (let index = 0; index < totalPage; index++) {
        try {
          const limit = this.pageSize;
          const offset = this.pageSize * index;

          const itemsOrder = await dbSiger.$ExecuteQuery<GetOrderItems>(
            `
            select 
              p.sigemp,
              p.codigo as pedidoCod,
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
              i.marcaCod,
              i.recusaCod,i.recusaDescicao,
    
              prod.descricao as produtoDescricao,
              prod.descricaoComplementar as produtoDescricaoComplementar,
              prod.referencia as produtoReferencia,
              prod.unidadeEstoque as produtoUnidadeEstoque,
              prod.gradeCod,
            
              g.descricao as gradeDescricao,
            
              cor1.descricao as corUmDescricao,
              cor2.descricao as corDoisDescricao,
            
              i.dtAlteracao
        
            from 01010s005.dev_pedido_v2 p
              inner join 01010s005.dev_pedido_item_v2 i on p.codigo = i.pedidoCod 
              inner join 01010s005.dev_produto prod on i.produtoCod = prod.codigo
              left join 01010s005.dev_grade_produto g on prod.gradeCod = g.codigo
              left join 01010s005.dev_cor_produto cor1 on prod.corUmCod = cor1.codigo
              left join 01010s005.dev_cor_produto cor2 on prod.corDoisCod = cor2.codigo
              
            ${whereNormalized}
            limit ${limit}
            offset ${offset}
          ;
  `
          );

          await this.sendOrder(itemsOrder);
          console.log(`${index + 1} de ${totalPage}`);
        } catch (error) {
          console.log(error);
        }
      }

      const endDate = new Date();

      console.log(`-> Total pedidos: ${totalPedidos}`);
      console.log(`-> Total itens: ${totalItems}`);
      console.log("-> " + (await diffDates(startDate, endDate)));
    } catch (error) {
      console.log(error);
    }
  }
}
