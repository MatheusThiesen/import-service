import { ProductLineRepository } from "../../entities/repositories/ProductLineRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";

interface ProductLinesNormalized {
  cod: number;
  name: string;
  status: number;
}

export class LineImportCommerce {
  constructor(
    private sendData: SendDataRepository,
    private productLineRepository: ProductLineRepository
  ) {}

  async execute() {
    const productLines = await this.productLineRepository.getAll({
      fields: {
        lineCode: true,
        lineDescription: true,
        lineSituation: true,
      },
    });

    const productLinesNormalized: ProductLinesNormalized[] = productLines.map(
      (line) => ({
        cod: line.lineCode,
        name: line.lineDescription,
        status: line.lineSituation,
      })
    );

    await this.sendData.post("/lines/import", productLinesNormalized);
  }
}
