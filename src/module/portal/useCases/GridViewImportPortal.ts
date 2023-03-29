import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetBrandsToSeller {
  codigo: string;
  descricao: string;
  c1: string;
  c2?: string;
  c3?: string;
  c4?: string;
  c5?: string;
  c6?: string;
  c7?: string;
  c8?: string;
  c9?: string;
  c10?: string;
  c11?: string;
  c12?: string;
  c13?: string;
  c14?: string;
  c15?: string;
  c16?: string;
  c17?: string;
  c18?: string;
  c19?: string;
}

interface SendGrid {
  codGrade: string;
  descricaoGrade: string;
  c1: string;
  c2?: string;
  c3?: string;
  c4?: string;
  c5?: string;
  c6?: string;
  c7?: string;
  c8?: string;
  c9?: string;
  c10?: string;
  c11?: string;
  c12?: string;
  c13?: string;
  c14?: string;
  c15?: string;
  c16?: string;
  c17?: string;
  c18?: string;
  c19?: string;
}

export class GridViewImportPortal {
  readonly pageSize = 50000;

  constructor(private sendData: SendData) {}

  async onNormalizedOrder(grids: GetBrandsToSeller[]): Promise<SendGrid[]> {
    return grids.map((grid) => ({
      codGrade: grid.codigo,
      descricaoGrade: grid.descricao,
      c1: grid.c1,
      c2: grid.c2,
      c3: grid.c3,
      c4: grid.c4,
      c5: grid.c5,
      c6: grid.c6,
      c7: grid.c7,
      c8: grid.c8,
      c9: grid.c9,
      c10: grid.c10,
      c11: grid.c11,
      c12: grid.c12,
      c13: grid.c13,
      c14: grid.c14,
      c15: grid.c15,
      c16: grid.c16,
      c17: grid.c17,
      c18: grid.c18,
      c19: grid.c19,
    }));
  }

  async sendBrandsToSeller(brandsToSeller: GetBrandsToSeller[]) {
    const normalized = await this.onNormalizedOrder(brandsToSeller);

    await this.sendData.post("/product/grid/import", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const whereNormalized = search ? `where ${search}` : ``;

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
        SELECT count(*) as total FROM 01010s005.dev_grade_produto g
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
            g.codigo,
            g.descricao,
            g.c1,g.c2,g.c3,g.c4,g.c5,g.c6,g.c7,g.c8,g.c9,g.c10,g.c11,g.c12,g.c13,g.c14,g.c15,g.c16,g.c17,g.c18,g.c19
          FROM 01010s005.dev_grade_produto g 
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
