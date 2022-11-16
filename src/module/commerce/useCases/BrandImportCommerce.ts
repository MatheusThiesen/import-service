import { BrandRepository } from "../../entities/repositories/BrandRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";

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

  async execute() {
    const brands = await this.brandRepository.getAll({
      fields: {
        code: true,
        description: true,
        situation: true,
      },
    });

    const brandsNormalized: BrandNormalized[] = brands.map((brand) => ({
      cod: brand.code,
      name: brand.description,
      status: brand.situation,
    }));

    await this.sendData.post("/brands/import", brandsNormalized);
  }
}
