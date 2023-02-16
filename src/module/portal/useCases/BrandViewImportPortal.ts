import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetBrand {
  sigemp: string;
  marcaCod: number;
  descricao: string;

  hrAlteracao: Date;
  dtAlteracao: Date;
}

interface SendBrand {
  codMarca: number;
  nomeMarca: string;
}

export class BrandViewImportPortal {
  readonly pageSize = 50000;

  constructor(private sendData: SendData) {}

  async onNormalizedOrder(brands: GetBrand[]): Promise<SendBrand[]> {
    return brands.map((brand) => ({
      codMarca: brand.marcaCod,
      nomeMarca: brand.descricao,
    }));
  }

  async sendBrand(itemsOrder: GetBrand[]) {
    const normalized = await this.onNormalizedOrder(itemsOrder);

    await this.sendData.post("/brand/import", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const whereNormalized = search ? `where ${search}` : ``;

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
        select count(*) as total from 01010s005.dev_marca m          
        ${whereNormalized};
        `
          )
        )[0].total
      );

      const totalPage = Math.ceil(totalItems / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const limit = this.pageSize;
        const offset = this.pageSize * index;

        const itemsOrder = await dbSiger.$ExecuteQuery<GetBrand>(
          `
          select 
            m.sigemp,
            m.marcaCod,
            m.descricao,
            m.dtAlteracao,
            m.hrAlteracao  
          from 01010s005.dev_marca m
            
          ${whereNormalized}
          order by m.marcaCod desc
          limit ${limit}
          offset ${offset}
          ;
          `
        );

        await this.sendBrand(itemsOrder);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
