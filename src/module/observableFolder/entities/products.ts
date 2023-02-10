import { Observable } from "../useCases/observable";
import { SendData } from "../useCases/sendData";

interface ProductsRecibe {
  codigo: number;
  situacao: number;
  codigoAlternativo: string;
  referencia: string;
  descricao: string;
  descricaoCompleta: string;
  descricaoAdicional: string;
  pdv: number;
  unidadeMedida: string;
  marcaCodigo: number;
  corPrimariaCodigo: number;
  corSecundariaCodigo: number;
  colecaoCodigo: number;
  linhaCodigo: number;
  grupoCodigo: number;
  subgrupoCodigo: number;
  generoCodigo: number;
  estoqueLivre: number;
  linhaProducao: number;
  precoVenda: number;
  bloqVenda: string;
}

export class Products {
  readonly entity = "products";

  constructor(private observable: Observable, private sendData: SendData) {}

  async execute() {
    const productsArr = await this.observable.execute<ProductsRecibe>({
      entity: this.entity,
    });

    for (const products of productsArr) {
      const normalizedData = products.data
        .filter((p) => p.codigoAlternativo)
        .map((product) => ({
          cod: product?.codigo,
          status:
            product?.linhaProducao === 0 &&
            product?.bloqVenda?.toLocaleUpperCase() !== "SIM"
              ? product?.situacao
              : 0,
          alternativeCode: product?.codigoAlternativo,
          reference: product?.referencia,
          description: product?.descricao,
          completeDescription: product?.descricaoCompleta,
          additionalDescription: product?.descricaoAdicional,
          salePrice: product?.pdv,
          unitMeasure: product?.unidadeMedida,
          marcaCodigo: product?.marcaCodigo,
          corPrimariaCodigo: product?.corPrimariaCodigo,
          corSecundariaCodigo: product?.corSecundariaCodigo,
          colecaoCodigo: product?.colecaoCodigo,
          linhaCodigo: product?.linhaCodigo,
          grupoCodigo: product?.grupoCodigo,
          subgrupoCodigo: product?.subgrupoCodigo,
          generoCodigo: product?.generoCodigo,
          precoVendaEmpresa: product?.precoVenda,
        }));

      await this.sendData.execute({
        file: products.file,
        entity: this.entity,
        route: "/products/import",
        data: normalizedData,
      });
    }
  }
}
