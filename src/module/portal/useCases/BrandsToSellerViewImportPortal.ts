import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetBrandsToSeller {
  representanteCod: number;
  marcaCod: number;
}

interface SendBrandsToSeller {
  codMarca: number;
  codRepresentante: number;
}

export class BrandsToSellerViewImportPortal {
  readonly pageSize = 50000;

  constructor(private sendData: SendData) {}

  async onNormalizedOrder(
    brands: GetBrandsToSeller[]
  ): Promise<SendBrandsToSeller[]> {
    return brands.map((brand) => ({
      codMarca: brand.marcaCod,
      codRepresentante: brand.representanteCod,
    }));
  }

  async sendBrandsToSeller(brandsToSeller: GetBrandsToSeller[]) {
    const normalized = await this.onNormalizedOrder(brandsToSeller);

    await this.sendData.post("/seller/import/sellerToBrand", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const whereNormalized = search ? `where ${search}` : ``;

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
        SELECT count(*) as total FROM 01010s005.DEV_REP_MARCA rm         
        ${whereNormalized};
        `
          )
        )[0].total
      );

      const totalPage = Math.ceil(totalItems / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const limit = this.pageSize;
        const offset = this.pageSize * index;

        const itemsOrder = await dbSiger.$ExecuteQuery<GetBrandsToSeller>(
          `
          SELECT 
            rm.representanteCod,
            rm.marcaCod 
          FROM 01010s005.DEV_REP_MARCA rm 
          ${whereNormalized}
          limit ${limit}
          offset ${offset};
          `
        );

        await this.sendBrandsToSeller(itemsOrder);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
