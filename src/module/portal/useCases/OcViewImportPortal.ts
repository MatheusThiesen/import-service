import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetOc {
  id: string;
  produtoCod: number;
  oc: number;
  item: number;
  referencia: string;
  situacao: number;
  qtd: number;
  qtdEntregue: number;
  qtdAberta: number;
  qtdCancelada: number;
  valorTotalLiquido: number;
  origem: string;
  ncm: string;
  dtEmissao: Date;
  motivoCancelamentoDesc: string;
}

interface SendOc {
  id: string;
  produtoCod: number;
  oc: number;
  item: number;
  referencia: string;
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
      situacao: oc.situacao,
      qtd: Number(oc.qtd),
      qtdEntregue: Number(oc.qtdEntregue),
      qtdAberta: Number(oc.qtdAberta),
      qtdCancelada: Number(oc.qtdCancelada),
      valorTotal: Number(oc.valorTotalLiquido),
      origem: String(oc.origem),
      ncm: String(oc.ncm),
      dtEmissao: oc.dtEmissao,
      motivoCancelamento: oc.motivoCancelamentoDesc
        ? String(oc.motivoCancelamentoDesc)
        : undefined,
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
      const whereNormalized = search ? `where ${search}` : undefined;

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
            oc.origem,
            oc.origemDesc,
            oc.ncm,
            oc.motivoCancelamentoDesc 
          from 01010s005.dev_oc oc
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
