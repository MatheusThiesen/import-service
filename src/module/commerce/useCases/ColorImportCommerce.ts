import { ColorRepository } from "../../../module/entities/repositories/ColorRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface ColorNormalized {
  cod: number;
  name: string;
  hex: string;
}

export class ColorImportCommerce {
  constructor(
    private sendData: SendDataRepository,
    private colorRepository: ColorRepository
  ) {}

  async execute({ search }: ExecuteServiceProps) {
    const colors = await this.colorRepository.getAll({
      fields: {
        colorCode: true,
        descriptionColor: true,
        rgbColor: true,
      },
      search: search,
    });

    const colorsNormalized: ColorNormalized[] = colors.content.map((color) => ({
      cod: color.colorCode,
      name: color.descriptionColor,
      hex: color.rgbColor,
    }));

    await this.sendData.post("/colors/import", colorsNormalized);
  }
}
