import { entities } from "../../../module/entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export interface ItemPriceNormalized {
  id?: string;
  codigo?: number;
  descricao?: string;
  valor?: number;
  situacao?: number;
  produtoCodigo?: number;
}

export class ListPriceImportCommerce {
  readonly pagesize = 5000;

  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = search;

      const totalItems = await entities.priceList.count({ search: query });
      const totalPages = Math.ceil(totalItems / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const listsItemsResponse = await entities.priceList.findAll({
          fields: {
            listaId: true,
            listaCod: true,
            listaDescricao: true,
            produtoCod: true,
            precoVenda: true,
            situacao: true,
          },

          search,

          page: page,
          pagesize: this.pagesize,
        });

        await this.sendData.post(
          "/price-lists/import",

          listsItemsResponse.map((item) => ({
            id: `${item.listaId}${item.listaCod}${item.produtoCod}`,
            codigo: item.listaCod,
            descricao: item.listaDescricao,
            valor: item.precoVenda,
            situation: item.situacao,
            produtoCodigo: item.produtoCod,
          }))
        );
      }
    } catch (error) {
      console.log("[LIST-PRICES][ERRO]");
    }
  }
}
