import { entities } from "../../../module/entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface ProductLinesNormalized {
  cod: number;
  name: string;
  status: number;
}

export class LineImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    const productLines = await entities.lineProduct.findAll({
      fields: {
        linhaCod: true,
        descricao: true,
        situacao: true,
      },
      search,
      pagesize: 99999,
    });

    const productLinesNormalized: ProductLinesNormalized[] = productLines.map(
      (line) => ({
        cod: line.linhaCod,
        name: line.descricao,
        status: line.situacao,
      })
    );

    await this.sendData.post("/lines/import", productLinesNormalized);
  }
}
