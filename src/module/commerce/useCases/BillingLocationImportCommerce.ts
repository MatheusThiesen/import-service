import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export class BillingLocationImportCommerce {
  readonly pagesize = 800;

  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = search;

      const totalItems = await entities.billingLocation.count({
        search: query,
      });
      const totalPages = Math.ceil(totalItems / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const billingLocation = await entities.billingLocation.findAll({
          fields: {
            localCobrancaCod: true,
            situacao: true,
            descricao: true,
          },

          search,

          page: page,
          pagesize: this.pagesize,
        });

        await this.sendData.post(
          "/billing-locations/import",

          billingLocation.map((item) => ({
            tabelaPrecoCod: item.localCobrancaCod,
            descricao: item.descricao,
            ativo: item.situacao,
          }))
        );
      }
    } catch (error) {
      console.log("[BILLING-LOCATION][ERRO]");
    }
  }
}
