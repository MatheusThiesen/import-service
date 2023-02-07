import { ItemPriceListRepository } from "../../entities/repositories/ItempriceListRepository";
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
  constructor(
    private sendData: SendDataRepository,
    private itemPriceListRepository: ItemPriceListRepository
  ) {}

  async execute({ search }: ExecuteServiceProps) {
    const query = search;

    const products = await this.itemPriceListRepository.getAll({
      fields: {
        identifier: true,
        priceList: {
          code: true,
          description: true,
          situation: true,
        },
        product: {
          code: true,
        },
        priceRange: {
          salePrice: true,
        },
      },

      search: query,
    });

    const itemPriceNormalized: ItemPriceNormalized[] = products.content.map(
      (item) => ({
        id: String(item.identifier),
        codigo: item.priceList.code,
        descricao: item.priceList.description,
        valor: item.priceRange[0].salePrice,
        situation: item.priceList.situation,
        produtoCodigo: item.product.code,
      })
    );

    await this.sendData.post("/price-lists/import", itemPriceNormalized);
  }
}
