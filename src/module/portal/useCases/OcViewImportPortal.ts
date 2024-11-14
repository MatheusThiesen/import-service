import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetOc {
  id: string;
  produtoCod: number;
  oc: number;
  item: number;
  diasVencimento: number;
  referencia: string;
  produtoDescricao: string;
  produtoGrupo: string;
  produtoColecao: string;
  situacao: number;
  qtd: number;
  qtdEntregue: number;
  qtdAberta: number;
  qtdCancelada: number;
  valorTotalLiquido: number;
  origem: string;
  ncm: string;
  dtEmissao: Date;
  dtPrazoEnrega: Date;
  motivoCancelamentoDesc: string;
}

interface SendOc {
  id: string;
  produtoCod: number;
  oc: number;
  diasVencimento: number;
  item: number;
  referencia: string;
  produtoDescricao: string;
  produtoGrupo: string;
  produtoColecao: string;
  situacao: number;
  qtd: number;
  qtdEntregue: number;
  qtdAberta: number;
  qtdCancelada: number;
  valorTotal: number;
  origem: string;
  ncm: string;
  dtEmissao: Date;
  motivoCancelamento: string;
}

export class OcViewImportPortal {
  readonly pageSize = 500;

  constructor(private sendData: SendData) {}

  async onNormalized(ocs: GetOc[]): Promise<SendOc[]> {
    return ocs.map((oc) => ({
      id: String(Number(oc.id)),
      produtoCod: oc.produtoCod,
      oc: oc.oc,
      item: oc.item,
      referencia: oc.referencia,
      produtoDescricao: oc.produtoDescricao,
      produtoGrupo: oc.produtoGrupo,
      produtoColecao: oc.produtoColecao,
      situacao: oc.situacao,
      qtd: Number(oc.qtd),
      qtdEntregue: Number(oc.qtdEntregue),
      qtdAberta: Number(oc.qtdAberta),
      qtdCancelada: Number(oc.qtdCancelada),
      valorTotal: Number(oc.valorTotalLiquido),
      origem: String(oc.origem),
      ncm: String(oc.ncm),
      dtEmissao: oc.dtEmissao,
      dtPrazoEnrega: oc.dtPrazoEnrega,
      motivoCancelamento: oc.motivoCancelamentoDesc
        ? String(oc.motivoCancelamentoDesc)
        : undefined,
      diasVencimento: Number(oc.diasVencimento),
    }));
  }

  async sendOc(ocs: GetOc[]) {
    try {
      const normalized = await this.onNormalized(ocs);

      await this.sendData.post("/oc/import", normalized);
    } catch (error) {
      console.log(error);
    }
  }

  async execute({ search }: { search?: string }) {
    try {
      const whereNormalized = search ? `where ${search}` : "";

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
              select count(*) as total from 01010s005.dev_oc oc            
              ${whereNormalized};
            `
          )
        )[0].total
      );

      const totalPage = Math.ceil(totalItems / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const limit = this.pageSize;
        const offset = this.pageSize * index;

        const ocs = await dbSiger.$ExecuteQuery<GetOc>(
          `
          select 
            oc.id,
            oc.produtoCod, 
            oc.oc,
            oc.item,
            oc.referencia,
            oc.situacao,
            oc.qtd,
            oc.qtdEntregue,
            oc.qtdAberta,
            oc.qtdCancelada,
            oc.valorTotalLiquido,
            oc.dtEmissao,
            oc.dtPrazoEnrega,
            oc.origem,
            oc.origemDesc,
            oc.ncm,
            oc.motivoCancelamentoDesc,
            oc.produtoDescricao,
            oc.produtoGrupo,
            oc.produtoColecao,
            v.diasVencimento
          from 01010s005.dev_oc oc
          inner join 01010s005.dev_oc_vencimentos v on v.oc = oc.oc
          ${whereNormalized}
          limit ${limit}
          offset ${offset}
          ;
          `
        );

        await this.sendOc(ocs);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
