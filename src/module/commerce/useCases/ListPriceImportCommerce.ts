import { ItemPriceList } from "src/module/entities/model/ItemPriceList";
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
  readonly size = 800;

  constructor(
    private sendData: SendDataRepository,
    private itemPriceListRepository: ItemPriceListRepository
  ) {}

  getNormalizedDate(items: ItemPriceList[]): ItemPriceNormalized[] {
    const normalized = items.map((item) => ({
      id: String(item.identifier),
      codigo: item.priceList.code,
      descricao: item.priceList.description,
      valor: item.priceRange[0].salePrice,
      situation: item.priceList.situation,
      produtoCodigo: item.product.code,
    }));

    return normalized;
  }

  async execute({ search }: ExecuteServiceProps) {
    const query = search;

    const itemsPrice = await this.itemPriceListRepository.getAll({
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

      isPagination: true,
      page: 0,
      size: this.size,
    });

    await this.sendData.post(
      "/price-lists/import",
      this.getNormalizedDate(itemsPrice.content)
    );

    const totalPages = Number(itemsPrice.totalPages);

    for (let index = 0; index < totalPages; index++) {
      const page = index + 1;

      console.log(`Lists price  ${page} de ${totalPages}`);

      const listsItemsResponse = await this.itemPriceListRepository.getAll({
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

        search,
        isPagination: true,
        page: page,
        size: this.size,
      });

      await this.sendData.post(
        "/price-lists/import",
        this.getNormalizedDate(listsItemsResponse.content)
      );
    }
  }
}
