import { ProductLineRepository } from "../../entities/repositories/ProductLineRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

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

  async execute({ search }: ExecuteServiceProps) {
    const productLines = await this.productLineRepository.getAll({
      fields: {
        lineCode: true,
        lineDescription: true,
        lineSituation: true,
      },
      search,
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
