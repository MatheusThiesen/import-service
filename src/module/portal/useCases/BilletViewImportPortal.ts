import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetBillet {
  clienteCod: number;
  representanteCod: number;
  numero: number;
  valor: number;
  dtVencimento: Date;
  ordem: number;
  idTipoDoc: string;
  parcela: number;
  sequencia: number;
  numBoleto: number;
  numBoletoDv: number;
  locCob: number;
  fazRemessa: number;
  banco: number;
  agencia: number;
  dtPagamento?: Date;
  situacao: number;
  dtAlteracao: Date;
}

interface SendBillet {
  codClienteBoleto: number;
  codRepresentanteBoleto: number;
  numeroDocumentoBoleto: string;
  valorBoleto: number;
  dataVencimentoBoleto: Date;
  desdobramentoBoleto: string;
  idTipoDocBoleto: string;
  parcelaBoleto: string;
  sequenciaBoleto: string;
  nossaNumeroBoleto: string;
  numBoletoDVBoleto: string;
  localCobrancaBoleto: string;
  fazRemessaBoleto: string;
  codBancoBoleto: string;
  agenciaBoleto: string;
  dataPagamentoBoleto: Date | string;
  dataUltimaAtualizacaoBoleto: Date;
}

export class BilletViewImportPortal {
  readonly pageSize = 5000;

  constructor(private sendData: SendData) {}

  async onNormalized(billets: GetBillet[]): Promise<SendBillet[]> {
    return billets.map((billet) => ({
      codClienteBoleto: billet.clienteCod,
      codRepresentanteBoleto: billet.representanteCod,
      numeroDocumentoBoleto: billet.numero.toString(),
      valorBoleto: billet.valor,
      dataVencimentoBoleto: billet.dtVencimento,
      desdobramentoBoleto: billet.ordem.toString(),
      idTipoDocBoleto: billet.idTipoDoc,
      parcelaBoleto: billet.parcela.toString(),
      sequenciaBoleto: billet.sequencia.toString(),
      nossaNumeroBoleto: billet.numBoleto.toString(),
      numBoletoDVBoleto: billet.numBoletoDv.toString(),
      localCobrancaBoleto: billet.locCob.toString(),
      fazRemessaBoleto: billet.fazRemessa === 1 ? "Sim" : "Não",
      codBancoBoleto: billet.banco.toString(),
      agenciaBoleto: billet.agencia.toString(),
      dataPagamentoBoleto: billet.dtPagamento ?? "00/00/0000",
      dataUltimaAtualizacaoBoleto: billet.dtAlteracao,
    }));
  }

  async sendBillet(billets: GetBillet[]) {
    const normalized = await this.onNormalized(billets);

    await this.sendData.post("/billet/import", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const query = `t.situacao in (1, 14)`;
      const whereNormalized = search
        ? `where ${search} and ${query}`
        : `where ${query}`;

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
              select count(*) as total from 01010s005.dev_titulo t            
              ${whereNormalized};
            `
          )
        )[0].total
      );

      const totalPage = Math.ceil(totalItems / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const limit = this.pageSize;
        const offset = this.pageSize * index;

        const billets = await dbSiger.$ExecuteQuery<GetBillet>(
          `
          select  
            t.clienteCod,
            t.representanteCod,
            t.numero,
            t.valor,
            t.dtVencimento,
            t.ordem,
            t.idTipoDoc,
            t.parcela,
            t.sequencia,
            t.numBoleto,
            t.numBoletoDv,
            t.locCob,
            t.fazRemessa,
            t.banco,
            t.agencia,
            t.dtPagamento,
            t.situacao,
            t.dtAlteracao
          from 01010s005.dev_titulo t
          ${whereNormalized}
          order by t.dtVencimento asc
          limit ${limit}
          offset ${offset}
          ;
          `
        );

        await this.sendBillet(billets);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
