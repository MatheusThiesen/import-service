import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export interface PaymentNormalized {
  tabelaVencimentoCod?: number;
  descricao?: number;
  quantidade?: string;
  valorMinimo?: number;
  ativo?: number;
  parcela1?: number;
  parcela2?: number;
  parcela3?: number;
  parcela4?: number;
  parcela5?: number;
  parcela6?: number;
  parcela7?: number;
  parcela8?: number;
}

export class PaymentConditionImportCommerce {
  readonly pagesize = 800;

  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = search;

      const totalItems = await entities.paymentCondition.count({
        search: query,
      });
      const totalPages = Math.ceil(totalItems / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const paymentConditionsResponse =
          await entities.paymentCondition.findAll({
            fields: {
              tabelaVencimentoCod: true,
              descricao: true,
              quantidade: true,
              valorMinimo: true,
              situacao: true,
              parcela1: true,
              parcela2: true,
              parcela3: true,
              parcela4: true,
              parcela5: true,
              parcela6: true,
              parcela7: true,
              parcela8: true,
            },

            search,

            page: page,
            pagesize: this.pagesize,
          });

        await this.sendData.post(
          "/payment-conditions/import",

          paymentConditionsResponse.map((item) => ({
            tabelaVencimentoCod: item.tabelaVencimentoCod,
            descricao: item.descricao,
            quantidade: item.quantidade,
            valorMinimo: item.valorMinimo,
            ativo: item.situacao,
            parcela1: item.parcela1,
            parcela2: item.parcela2,
            parcela3: item.parcela3,
            parcela4: item.parcela4,
            parcela5: item.parcela5,
            parcela6: item.parcela6,
            parcela7: item.parcela7,
            parcela8: item.parcela8,
          }))
        );
      }
    } catch (error) {
      console.log("[PAYMENTS][ERRO]");
    }
  }
}
