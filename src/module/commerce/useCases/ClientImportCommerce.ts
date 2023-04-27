import { numberToString } from "../../../helpers/numberToString";
import { stringToNumber } from "../../../helpers/stringToNumber";
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
  readonly pagesize = 1600;

  constructor(private sendData: SendDataRepository) {}

  async normalizedClient(clients: Client[]) {
    const normalized: IClientNormalized[] = [];

    for (const client of clients) {
      const normalizedClient: IClientNormalized = {
        codigo: client.clienteCod,
        obs: ``,
        obsRestrita: ``,
        cnpj: ("00000000000000" + numberToString(client.cnpj)).slice(-14),
        credito: stringToNumber(client.credito),
        razaoSocial: client.razaoSocial,
        nomeFantasia: client.nomeFantasia,
        incricaoEstadual: client.ie,
        celular: numberToString(client.celular),
        telefone: numberToString(client.telefone),
        telefone2: numberToString(client.telefone2),
        eAtivo: stringToNumber(client.ativo),
        uf: client.uf,
        cidadeIbgeCod: stringToNumber(client.cidadeIbgeCod),
        cidade: client.cidade,
        bairro: client.bairro,
        logradouro: client.logradouro,
        numero: numberToString(client.numero),
        complemento: client.complemento,
        cep: numberToString(client.cep),
        ramoAtividadeCodigo: stringToNumber(client.grupoCadCod),
        conceitoCodigo: stringToNumber(client.conceitoCod),
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
