import {
  ProductImage,
  ProductImageFields,
} from "src/module/entities/model/ProductImage";
import { entities } from "../../entities/useCases";
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

export class ProductImageImportCommerce {
  readonly pagesize = 2000;

  constructor(private sendData: SendDataRepository) {}

  removeExtension(filename: string) {
    const splitName = filename.split(".");
    return splitName.filter((_, i) => i !== splitName.length - 1).join(".");
  }

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = search;

      const totalItems = await entities.productImage.count({ search: query });
      const totalPages = Math.ceil(totalItems / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const productImageResponse = await entities.productImage.findAll<
          ProductImageFields,
          ProductImage
        >({
          fields: {
            produtoCod: true,
            imagemNome: true,
            sequencia: true,
          },

          search,

          page: page,
          pagesize: this.pagesize,
        });

        await this.sendData.post(
          "/product-imagens/import",

          productImageResponse.map((item) => ({
            imagemNome: this.removeExtension(item.imagemNome),
            sequencia: Number(item.sequencia),
            produtoCodigo: Number(item.produtoCod),
          }))
        );
      }
    } catch (error) {
      console.log("[PRODUCT-IMAGE][ERRO]");
    }
  }
}
