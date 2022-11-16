import { ColorRepository } from "../../../module/entities/repositories/ColorRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";

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

  async execute() {
    const colors = await this.colorRepository.getAll({
      fields: {
        colorCode: true,
        descriptionColor: true,
        rgbColor: true,
      },
    });

    const colorsNormalized: ColorNormalized[] = colors.map((color) => ({
      cod: color.colorCode,
      name: color.descriptionColor,
      hex: color.rgbColor,
    }));

    await this.sendData.post("/colors/import", colorsNormalized);
  }
}
