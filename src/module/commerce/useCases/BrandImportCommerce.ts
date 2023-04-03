import { entities } from "../../../module/entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface BrandNormalized {
  cod: number;
  name: string;
  status: number;
}

export class BrandImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    const brands = await entities.brand.findAll({
      fields: {
        marcaCod: true,
        descricao: true,
        situacao: true,
      },
      search,
    });

    const brandsNormalized: BrandNormalized[] = brands.map((brand) => ({
      cod: brand.marcaCod,
      name: brand.descricao,
      status: brand.situacao,
    }));

    await this.sendData.post("/brands/import", brandsNormalized);
  }
}
