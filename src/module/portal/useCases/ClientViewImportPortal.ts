import { stringToNumber } from "../../../helpers/stringToNumber";
import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetCliente {
  clienteCod: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  email2: string;
  celular: number;
  telefone: number;
  telefone2: number;
  cep: number;
  uf: string;
  cidade: string;
  numero: number;
  bairro: string;
  logradouro: string;
  tipo: string;
  conceitoCod: string;
  grupoCadCod: number;
  ativo: number;
  dda: number;
  suframa: string;
  ie: string;
  dtFundacao: Date;
  dtAlteracao: Date;
}

interface SendClient {
  codCliente: number;
  cnpjCliente: string;
  razaoSocialCliente: string;
  nomeFantasiaCliente: string;
  emailCliente: string;
  email2Cliente: string;
  telefoneCliente: string;
  telefone2Cliente: string;
  celularCliente: string;
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
  dataUltimaCompra: Date | undefined;
  situacaoCliente: string;
  suframa: string;
  ie: string;
  dtFundacao: Date;
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
    return Promise.all(
      clients.map(async (client) => {
        const lastOrderDate = await dbSiger.$ExecuteQuery<{
          dtEntrada?: Date;
        }>(`
          select p.dtEntrada  from 01010s005.dev_pedido p
          where p.clienteCod = ${client.clienteCod}
          order by p.dtEntrada desc
          limit 1;
          `);

        const dataUltimaCompra: Date | undefined =
          lastOrderDate && lastOrderDate?.[0]?.dtEntrada
            ? new Date(lastOrderDate?.[0]?.dtEntrada)
            : undefined;

        return {
          codCliente: client.clienteCod,
          conceitoCod: stringToNumber(client.conceitoCod),
          cnpjCliente: this.normalizedCNPJ(String(client.cnpj)),
          razaoSocialCliente: client.razaoSocial,
          nomeFantasiaCliente: client.nomeFantasia,
          emailCliente: client.email,
          email2Cliente: client.email2,
          telefoneCliente: String(client.telefone),
          telefone2Cliente: String(client.telefone2),
          celularCliente: String(client.celular),
          cepCliente: String(client.cep),
          ufCliente: client.uf,
          cidadeCliente: client.cidade,
          bairroCliente: client.bairro,
          logradouroCliente: client.logradouro,
          numeroLogradouroCliente: client.numero,
          tipoCadastroCliente: client.tipo,
          idGrupoCadCliente: String(client.grupoCadCod),
          dataModificacaoCliente: client.dtAlteracao,
          dataUltimaCompra: dataUltimaCompra,
          situacaoCliente: String(client.ativo),
          suframa: client.suframa,
          ie: client.ie,
          dtFundacao: client.dtFundacao,
          ddaCliente: client.dda === 1 ? "Sim" : "Não",
        };
      })
    );
  }

  async sendClient(sellers: GetCliente[]) {
    const normalized = await this.onNormalizedOrder(sellers);

    await this.sendData.post("/clientPj/import", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const query = "c.tipo = 'C'";

      const whereNormalized = search
        ? `where ${query}  and ${search}`
        : `where ${query}`;

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
              select count(*) as total from 01010s005.dev_cliente c            
              ${whereNormalized}
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
            e.email2,
            c.celular,
            c.telefone,
            c.telefone2,
            c.cep,
            c.uf,
            c.cidade,
            c.bairro,
            c.logradouro,
            c.numero,
            c.tipo,
            c.grupoCadCod,
            c.ativo,
            c.dda,
            c.conceitoCod,
            c.suframa,
            c.ie,
            c.dtFundacao,
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
