import { NumberToString } from "src/helpers/NumberToString";
import { Client } from "../../../module/entities/model/Client";
import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export interface IClientNormalized {
  codigo: number;
  obs?: string;
  obsRestrita?: string;
  cnpj: string;
  credito: number;
  razaoSocial: string;
  nomeFantasia: string;
  incricaoEstadual?: string;
  celular?: string;
  telefone?: string;
  telefone2?: string;
  eAtivo?: number;
  uf: string;
  cidadeIbgeCod?: number;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  cep: string;
  ramoAtividadeCodigo?: number;
  conceitoCodigo?: number;
}

export class ClientImportCommerce {
  readonly pagesize = 1000;

  constructor(private sendData: SendDataRepository) {}

  async normalizedClient(clients: Client[]) {
    const normalized: IClientNormalized[] = [];

    for (const client of clients) {
      const normalizedClient: IClientNormalized = {
        codigo: client.clienteCod,
        obs: ``,
        obsRestrita: ``,
        cnpj: NumberToString(client.cnpj),
        credito: client.credito,
        razaoSocial: client.razaoSocial,
        nomeFantasia: client.nomeFantasia,
        incricaoEstadual: client.ie,
        celular: NumberToString(client.celular),
        telefone: NumberToString(client.telefone),
        telefone2: NumberToString(client.telefone2),
        eAtivo: client.ativo,
        uf: client.uf,
        cidadeIbgeCod: client.cidadeIbgeCod,
        cidade: client.cidade,
        bairro: client.bairro,
        logradouro: client.logradouro,
        numero: NumberToString(client.numero),
        complemento: client.complemento,
        cep: NumberToString(client.cep),
        ramoAtividadeCodigo: client.grupoCadCod,
        conceitoCodigo: client.conceitoCod,
      };

      try {
        const clientObsResponse = await entities.clientObs.findOne({
          search: `o.clienteCod = ${client.clienteCod}`,
          fields: {
            clienteCod: true,
            observacoes: true,
            observacoesRestritas: true,
          },
        });

        if (clientObsResponse) {
          normalizedClient.obs = clientObsResponse.observacoes;
          normalizedClient.obsRestrita = clientObsResponse.observacoesRestritas;
        }
      } catch (error) {}

      normalized.push(normalizedClient);
    }

    return normalized;
  }

  async execute({ search }: ExecuteServiceProps) {
    const query = search;

    const totalClient = await entities.client.count({ search: query });
    const totalPages = Math.ceil(totalClient / this.pagesize);

    for (let index = 0; index < totalPages; index++) {
      const page = index;

      const clientsResponse = await entities.client.findAll({
        fields: {
          clienteCod: true,
          cnpj: true,
          credito: true,
          razaoSocial: true,
          nomeFantasia: true,
          ie: true,
          celular: true,
          telefone: true,
          telefone2: true,
          ativo: true,
          uf: true,
          cidadeIbgeCod: true,
          cidade: true,
          bairro: true,
          logradouro: true,
          numero: true,
          complemento: true,
          cep: true,
          conceitoCod: true,
          grupoCadCod: true,
        },

        search,

        page: page,
        pagesize: this.pagesize,
      });

      const clients = await this.normalizedClient(clientsResponse);

      await this.sendData.post("/clients/import", clients);
    }
  }
}
