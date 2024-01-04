import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetSeller {
  sigemp: string;
  representanteCod: number;
  cnpj: string;
  tipoRep: number;
  abreviacao: string;
  descricao: string;
  email: string;
  fone: string;
  supervisorCod: number;
  gerenteCod: number;
  eGerente: number;
  eSupervisor: number;
  situacao: number;
  dtAlteracao: Date;
}

interface SendSeller {
  codRepresentante: number;
  cnpjRepresentante: string;
  tipoRepresentante: number;
  abreviacaoRepresentante: string;
  nomeCompletoRepresentante: string;
  emailRepresentante?: string;
  telefoneRepresentante: string;
  activeRepresentante: number;
  isGerRepresentante?: string;
  isSupRepresentante?: string;
  codGerenteRepresentante: number;
  codSupervisorRepresentante: number;
}

export class SellerViewImportPortal {
  readonly pageSize = 50000;

  constructor(private sendData: SendData) {}

  normalizedCNPJ(cnpj: string) {
    const zeros = "00000000000000";
    return String(zeros.substring(0, 14 - cnpj.length) + cnpj);
  }

  async onNormalizedOrder(sellers: GetSeller[]): Promise<SendSeller[]> {
    return sellers.map((seller) => ({
      codRepresentante: seller.representanteCod,
      tipoRepresentante: seller?.tipoRep,
      cnpjRepresentante: this.normalizedCNPJ(seller?.cnpj),
      abreviacaoRepresentante: seller.abreviacao,
      nomeCompletoRepresentante: seller.descricao,
      emailRepresentante: seller.email,
      telefoneRepresentante: seller.fone
        ? String(Number(seller.fone))
        : String(0),
      activeRepresentante: seller.situacao,
      isGerRepresentante: seller.eGerente === 1 ? "Sim" : "Nao",
      isSupRepresentante: seller.eSupervisor === 1 ? "Sim" : "Nao",
      codGerenteRepresentante: seller.gerenteCod,
      codSupervisorRepresentante: seller.supervisorCod,
    }));
  }

  async sendSeller(sellers: GetSeller[]) {
    const normalized = await this.onNormalizedOrder(sellers);

    await this.sendData.post("/seller/import", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const whereNormalized = search ? `where ${search}` : ``;

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
              select count(*) as total from 01010s005.dev_representante r           
              ${whereNormalized};
            `
          )
        )[0].total
      );

      const totalPage = Math.ceil(totalItems / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const limit = this.pageSize;
        const offset = this.pageSize * index;

        const sellers = await dbSiger.$ExecuteQuery<GetSeller>(
          `
          select 
            r.sigemp,
            r.representanteCod,
            r.abreviacao,
            r.descricao,
            r.email,
            r.fone,
            r.supervisorCod,
            r.gerenteCod,
            r.eGerente,
            r.eSupervisor,
            r.situacao,
            r.cnpj, 
            r.tipoRep,
            r.dtAlteracao
          from 01010s005.dev_representante r 
            
          ${whereNormalized}
          order by r.representanteCod desc
          limit ${limit}
          offset ${offset}
          ;
          `
        );

        await this.sendSeller(sellers);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
