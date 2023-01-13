import { BrandRepository } from "../../entities/repositories/BrandRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface BrandNormalized {
  cod: number;
  name: string;
  status: number;
}

export class BrandImportCommerce {
  constructor(
    private sendData: SendDataRepository,
    private brandRepository: BrandRepository
  ) {}

  async execute({ search }: ExecuteServiceProps) {
    const brands = await this.brandRepository.getAll({
      fields: {
        code: true,
        description: true,
        situation: true,
      },
      search,
    });

    const brandsNormalized: BrandNormalized[] = brands.content.map((brand) => ({
      cod: brand.code,
      name: brand.description,
      status: brand.situation,
    }));

    await this.sendData.post("/brands/import", brandsNormalized);
  }
}
