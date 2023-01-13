import { ProductRepository } from "../../entities/repositories/ProductRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";

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

  async execute() {
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

      // search: `lastChangeDate IN ( "24/10/2022") AND brand.code NEQ 0 AND situation IN (1)`,
      // search: `brand.code IN (2,10,23) AND collection.collectionCode IN (233,66,48) OR ( brand.code IN (400) AND situation IN (2) )`,
      search: `
        brand.code IN (2) and  situation IN (2) and code in (211752)
        `,
    });
    // collection.collectionCode IN (233,66,48)

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
