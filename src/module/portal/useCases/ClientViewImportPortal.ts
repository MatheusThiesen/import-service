import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetCliente {
  clienteCod: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  telefone: number;
  cep: number;
  uf: string;
  cidade: string;
  numero: number;
  bairro: string;
  logradouro: string;
  tipo: string;
  grupocadCpd: number;
  ativo: number;
  dda: number;
  dtAlteracao: Date;
}

interface SendClient {
  codCliente: number;
  cnpjCliente: string;
  razaoSocialCliente: string;
  nomeFantasiaCliente: string;
  emailCliente: string;
  telefoneCliente: string;
  cepCliente: string;
  ufCliente: string;
  cidadeCliente: string;
  bairroCliente: string;
  logradouroCliente: string;
  numeroLogradouroCliente: number;
  latitudeCliente?: number;
  longitudeCliente?: number;
  tipoCadastroCliente: string;
  idGrupoCadCliente: string;
  dataModificacaoCliente: Date;
  situacaoCliente: string;
  ddaCliente: "Sim" | "Não";
}

export class ClientViewImportPortal {
  readonly pageSize = 10000;

  constructor(private sendData: SendData) {}

  normalizedCNPJ(cnpj: string) {
    const zeros = "00000000000000";
    return String(zeros.substring(0, 14 - cnpj.length) + cnpj);
  }

  async onNormalizedOrder(clients: GetCliente[]): Promise<SendClient[]> {
    return clients.map((client) => ({
      codCliente: client.clienteCod,
      cnpjCliente: this.normalizedCNPJ(String(client.cnpj)),
      razaoSocialCliente: client.razaoSocial,
      nomeFantasiaCliente: client.nomeFantasia,
      emailCliente: client.email,
      telefoneCliente: String(client.telefone),
      cepCliente: String(client.cep),
      ufCliente: client.uf,
      cidadeCliente: client.cidade,
      bairroCliente: client.bairro,
      logradouroCliente: client.logradouro,
      numeroLogradouroCliente: client.numero,
      tipoCadastroCliente: client.tipo,
      idGrupoCadCliente: String(client.grupocadCpd),
      dataModificacaoCliente: client.dtAlteracao,
      situacaoCliente: String(client.ativo),
      ddaCliente: client.dda === 1 ? "Sim" : "Não",
    }));
  }

  async sendClient(sellers: GetCliente[]) {
    const normalized = await this.onNormalizedOrder(sellers);

    await this.sendData.post("/clientPj/import", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const query = `c.tipo = 'C'`;
      const whereNormalized = search
        ? `where ${search} and ${query}`
        : `where ${query}`;

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
              select count(*) as total from 01010s005.dev_cliente c            
              ${whereNormalized};
            `
          )
        )[0].total
      );

      const totalPage = Math.ceil(totalItems / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const limit = this.pageSize;
        const offset = this.pageSize * index;

        const clients = await dbSiger.$ExecuteQuery<GetCliente>(
          `
          select 
            c.clienteCod,
            c.cnpj,
            c.razaoSocial,
            c.nomeFantasia,
            e.email,
            c.telefone,
            c.cep,
            c.uf,
            c.cidade,
            c.bairro,
            c.logradouro,
            c.numero,
            c.tipo,
            c.grupocadCpd,
            c.ativo,
            c.dda,
            c.dtAlteracao    
          from 01010s005.dev_cliente c 
          left join 01010s005.dev_cliente_email e on e.clienteCod = c.clienteCod
          ${whereNormalized}
          order by c.clienteCod desc
          limit ${limit}
          offset ${offset}
          ;
          `
        );

        await this.sendClient(clients);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
