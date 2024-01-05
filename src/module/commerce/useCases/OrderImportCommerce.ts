import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export class OrderImportCommerce {
  readonly pagesize = 800;

  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = search;

      const totalItems = await entities.order.count({ search: query });
      const totalPages = Math.ceil(totalItems / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const orders = await entities.order.findAll({
          fields: {
            codigo: true,
            posicaoDetalhadaCod: true,
            posicaoDescricao: true,
            posicaoDetalhadaDescicao: true,
          },

          search,

          page: page,
          pagesize: this.pagesize,
        });

        await this.sendData.post(
          "/orders/import",

          orders.map((item) => ({
            codigo: item.codigo,
            status: item?.posicaoTratada?.toLowerCase(),
          }))
        );
      }
    } catch (error) {
      console.log("[ORDERS][ERRO]");
    }
  }
}
