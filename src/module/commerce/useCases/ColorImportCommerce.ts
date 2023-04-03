import { entities } from "../../../module/entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface ColorNormalized {
  cod: number;
  name: string;
  hex: string;
}

export class ColorImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    const colors = await entities.color.findAll({
      fields: {
        corCod: true,
        descricao: true,
        rgb: true,
      },
      search: search,
      pagesize: 99999,
    });

    const colorsNormalized: ColorNormalized[] = colors.map((color) => ({
      cod: color.corCod,
      name: color.descricao,
      hex: color.rgb,
    }));

    await this.sendData.post("/colors/import", colorsNormalized);
  }
}
