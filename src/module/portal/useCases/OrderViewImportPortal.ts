import { dbSiger } from "../../../service/dbSiger";

interface GetOrderItems {
  sigemp: string;
  pedidoCod: number;
  clienteCod: number;
  vlrTotalMercadoria: string;
  vlrNota: string;
  descricao: string;
  dtFaturamento: Date;
  dtEntrada: Date;
  formaPagamento: string;
  especieCod: number;
  transportadoraCod: number;
  produtoCod: number;
  itemPosition: string;
  qtd: string;
  vlrLiquido: string;
  vlrUnitario: string;
  marcaCod: number;
  recusaCod: number;
  recusaDescicao: string;
  descricaoComplementar: string;
  referencia: string;
  unidadeEstoque: string;
  gradeCod: number;
  gradeDescricao: string;
  corUmDescricao: string;
  corDoisDescricao: string;
  numeroNota: number;
  serieNota: string;
  dtAlteracao: Date;
}

export class OrderViewImportPortal {
  constructor() {}

  async execute({ search }: { search: string }) {
    try {
      const whereNormalized = search ? `where ${search}` : undefined;

      const response = await dbSiger.$ExecuteQuery<GetOrderItems>(
        `
        select distinct
		      p.sigemp,
		      p.codigo as pedidoCod,
          p.posicaoDetalhadaCod,
          p.posicaoDetalhadaDescicao,
          p.clienteCod,
          p.vlrTotalMercadoria,
          p.vlrNota,
          prod.descricao,
          p.dtFaturamento,
          p.dtEntrada,
          p.formaPagamento,
          p.especieCod,
          p.transportadoraCod,
		
          i.id, 
          i.produtoCod,
          i.posicao as itemPosition,
          i.qtd,
          i.vlrLiquido,
          i.vlrUnitario as vlrUnitario,
		      i.marcaCod,
		      i.recusaCod,i.recusaDescicao,

		      prod.descricaoComplementar,
		      prod.referencia,
		      prod.unidadeEstoque,
          prod.gradeCod,
        
          g.descricao as gradeDescricao,
        
          cor1.descricao as corUmDescricao,
          cor2.descricao as corDoisDescricao,
		
          n.numeroNota,
          n.serieNota,
        
		      i.dtAlteracao
		
        from 01010s005.dev_pedido p
          inner join 01010s005.dev_pedido_item i on p.codigo = i.pedidoCod 
          inner join 01010s005.dev_produto prod on i.produtoCod = prod.codigo
          left join 01010s005.dev_grade_produto g on prod.gradeCod = g.codigo
          left join 01010s005.dev_cor_produto cor1 on prod.corUmCod = cor1.codigo
          left join 01010s005.dev_cor_produto cor2 on prod.corDoisCod = cor2.codigo
          left join 01010s005.dev_pedido_nota n on p.codigo = n.pedidoCod
        ${whereNormalized};
`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}
