import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export interface TablePriceNormalized {
  tabelaPrecoCod?: number;
  descricao?: string;
  ativo?: number;
}

export class TablePriceImportCommerce {
  readonly pagesize = 800;

  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = search;

      const totalItems = await entities.tablePrice.count({ search: query });
      const totalPages = Math.ceil(totalItems / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const tablePricesResponse = await entities.tablePrice.findAll({
          fields: {
            tabelaPrecoCod: true,
            situacao: true,
            descricao: true,
          },

          search,

          page: page,
          pagesize: this.pagesize,
        });

        await this.sendData.post(
          "/price-tables/import",

          tablePricesResponse.map((item) => ({
            tabelaPrecoCod: item.tabelaPrecoCod,
            descricao: item.descricao,
            ativo: item.situacao,
          }))
        );
      }
    } catch (error) {
      console.log("[TABLE-PRICES][ERRO]");
    }
  }
}
