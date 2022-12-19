import { readdir } from "fs/promises";
import * as path from "path";
import * as XLSX from "xlsx";
import { file as serviceFile } from "../../../helpers/file";
import { SendDataRepository } from "../../../module/commerce/repositories/SendDataRepository";
import { ProductNormalized } from "../../../module/commerce/useCases/ProductImportCommerce";
import { StockLocationNormalized } from "../../../module/commerce/useCases/StockLocationImportCommerce";

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
}

export class Products {
  private observableFolder: string;

  constructor(private sendData: SendDataRepository) {
    this.observableFolder = process.env.OBSERVABLE_FOLDER;
  }

  async xlsxToJson<T>(filepath: string): Promise<T[]> {
    let fileXlsx = XLSX.readFile(filepath, {
      cellDates: true,
    });

    let aba = fileXlsx.Sheets[fileXlsx.SheetNames[0]];
    return XLSX.utils.sheet_to_json(aba);
  }

  async execute(entity: string) {
    const listFiles = await readdir(
      path.resolve(this.observableFolder, entity)
    );

    const listFilter = listFiles.filter((file) => {
      const [namefile, mimetype] = file.split(".");
      const [firstName] = namefile.split("_");

      if (
        mimetype !== undefined &&
        mimetype?.trim()?.toUpperCase() === "XLSX" &&
        firstName?.trim()?.toUpperCase() === entity?.trim()?.toUpperCase()
      ) {
        return true;
      } else {
        return false;
      }
    });

    for (const file of listFilter) {
      try {
        await serviceFile.move(
          path.resolve(this.observableFolder, entity, file),
          path.resolve(this.observableFolder, entity, "processing", file)
        );

        const products: ProductsRecibe[] =
          await this.xlsxToJson<ProductsRecibe>(
            path.resolve(this.observableFolder, entity, "processing", file)
          );

        const productsNormalized: ProductNormalized[] = products
          .filter((p) => p.codigoAlternativo)
          .map((product) => ({
            cod: product?.codigo,
            status: product?.linhaProducao === 0 ? product?.situacao : 0,
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
          }));

        const stockLocationNormalized: StockLocationNormalized[] = products.map(
          (product) => ({
            period: "pronta-entrega",
            name: "Pronta Entrega",
            productCod: product.codigo,
            qtd: product.estoqueLivre,
          })
        );

        await this.sendData.post("/products/import", productsNormalized);
        console.log("importado " + productsNormalized.length + "produtos");
        await this.sendData.post(
          "/stock-locations/import",
          stockLocationNormalized
        );
        console.log("importado " + productsNormalized.length + "estoques");

        await serviceFile.move(
          path.resolve(this.observableFolder, entity, "processing", file),
          path.resolve(this.observableFolder, entity, "imported", file)
        );
      } catch (error) {
        console.log(error);

        await serviceFile.move(
          path.resolve(this.observableFolder, entity, "processing", file),
          path.resolve(this.observableFolder, entity, "noimported", file)
        );
      }
    }
  }
}
