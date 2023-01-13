import { entities } from "../../entities/useCases/index";
import { SendData } from "../repositories/SendData";

interface ProductSendProps {
  codigo: number;
  codAlternativo: string;
  referencia: string;
  descricao: string;
  corPrimaria: number;
  corSecundaria?: number;
  unidadeMedida: string;
  ncm: number;
  ean?: number;
  gradeCod: number;
  grade: string;
  eGrad: "N" | "S";
  pdv?: number;
  codMarca: number;
}

export class ProductImportPortal {
  constructor(private sendData: SendData) {}

  async execute() {
    const products = await entities.product.getAll({
      fields: {
        code: true,
        alternateCode: true,
        reference: true,
        description: true,
        predominantColor: {
          colorCode: true,
        },
        secondColor: {
          colorCode: true,
        },
        unitMeasure: {
          unit: true,
        },
        taxClassification: true,
        EANCode: true,
        grid: {
          code: true,
          description: true,
        },
        salePrice: true,
        brand: {
          code: true,
        },
      },
      // search: 'lastChangeDate IN ( "19/09/2022")',
      search: "code IN (1)",
    });

    const productNormalized: ProductSendProps[] = products.content.map(
      (product) => ({
        codigo: product?.code,
        codAlternativo: product?.alternateCode,
        referencia: product?.reference,
        descricao: product?.description,
        corPrimaria: product?.predominantColor?.colorCode,
        corSecundaria: product?.secondColor?.colorCode,
        unidadeMedida: product?.unitMeasure?.unit,
        ncm: product?.taxClassification,
        // ean: product?.EANCode,
        gradeCod: product?.grid?.code,
        grade: product?.grid?.description,
        eGrad: "S",
        pdv: product?.salePrice,
        codMarca: product?.brand?.code,
      })
    );

    await this.sendData.post("/product/import", productNormalized);
  }
}
