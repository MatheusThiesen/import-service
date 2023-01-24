import { ProductRepository } from "../../entities/repositories/ProductRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export interface ProductNormalized {
  cod: number;
  status: number;
  alternativeCode: string;
  reference: string;
  description: string;
  completeDescription: string;
  salePrice: number;
  unitMeasure: string;
  marcaCodigo?: number;
  corPrimariaCodigo?: number;
  corSecundariaCodigo?: number;
  colecaoCodigo?: number;
  linhaCodigo?: number;
  grupoCodigo?: number;
  subgrupoCodigo?: number;
  precoVendaEmpresa?: number;
}

export class ProductImportCommerce {
  constructor(
    private sendData: SendDataRepository,
    private productRepository: ProductRepository
  ) {}

  async execute({ search }: ExecuteServiceProps) {
    const query = `brand.code IN (10,20,1,24,23,2,26,400) ${
      search ? `AND ${search}` : ""
    }`;
    // brand.code IN (2) and  situation IN (2) and code in (211752)

    const products = await this.productRepository.getAll({
      fields: {
        code: true,
        situation: true,
        alternateCode: true,
        reference: true,
        description: true,
        completeDescription: true,
        additionalDescription: true,
        // salePrice: true,
        promotionalPrice: true,
        brand: {
          code: true,
        },
        unitMeasure: {
          unit: true,
        },
        predominantColor: {
          colorCode: true,
        },
        secondColor: {
          colorCode: true,
        },
        collection: {
          collectionCode: true,
        },
        productLine: {
          lineCode: true,
        },
        group: {
          code: true,
        },
        subgroup: {
          code: true,
        },
      },

      search: query,
    });

    const productNormalized: ProductNormalized[] = products.content.map(
      (product) => ({
        cod: product.code,
        status: product.situation,
        alternativeCode: product.alternateCode,
        reference: product.reference,
        description: product.description,
        completeDescription: product.completeDescription,
        additionalDescription: product.additionalDescription,
        salePrice: product.promotionalPrice,
        unitMeasure: product?.unitMeasure?.unit,
        marcaCodigo: product?.brand?.code,
        corPrimariaCodigo: product?.predominantColor?.colorCode,
        corSecundariaCodigo: product?.secondColor?.colorCode,
        colecaoCodigo: product?.collection?.collectionCode,
        linhaCodigo: product?.productLine?.lineCode,
        grupoCodigo: product?.group?.code,
        subgrupoCodigo: product?.subgroup?.code,
      })
    );

    await this.sendData.post("/products/import", productNormalized);
  }
}
