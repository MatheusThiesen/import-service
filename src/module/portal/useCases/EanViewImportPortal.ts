import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetBrandsToSeller {
  produtoCod: string;
  gradeCod: string;
  gradeDescricao: string;
  sequencial: string;
  ean: string;
  qtd1: string;
  qtd2: string;
  qtd3: string;
  qtd4: string;
  qtd5: string;
  qtd6: string;
  qtd7: string;
  qtd8: string;
  tipoEmb1: string;
  tipoEmb2: string;
  tipoEmb3: string;
  tipoEmb4: string;
  tipoEmb5: string;
  tipoEmb6: string;
  tipoEmb7: string;
  tipoEmb8: string;
}

interface SendGrid {
  codProduto: string;
  codGrade: string;
  decriçãoGrade: string;
  sequencial: string;
  idEan: string;
  qtd1: string;
  qtd2: string;
  qtd3: string;
  qtd4: string;
  qtd5: string;
  qtd6: string;
  qtd7: string;
  qtd8: string;
  tipoEmb1: string;
  tipoEmb2: string;
  tipoEmb3: string;
  tipoEmb4: string;
  tipoEmb5: string;
  tipoEmb6: string;
  tipoEmb7: string;
  tipoEmb8: string;
}

export class EanViewImportPortal {
  readonly pageSize = 50000;

  constructor(private sendData: SendData) {}

  async onNormalizedEan(grids: GetBrandsToSeller[]): Promise<SendGrid[]> {
    return grids.map((grid) => ({
      codProduto: grid.produtoCod,
      codGrade: grid.gradeCod,
      decriçãoGrade: grid.gradeDescricao,
      sequencial: Number(grid.sequencial).toString(),
      idEan: grid.sequencial,
      qtd1: grid.qtd1,
      qtd2: grid.qtd2,
      qtd3: grid.qtd3,
      qtd4: grid.qtd4,
      qtd5: grid.qtd5,
      qtd6: grid.qtd6,
      qtd7: grid.qtd7,
      qtd8: grid.qtd8,
      tipoEmb1: grid.tipoEmb1,
      tipoEmb2: grid.tipoEmb2,
      tipoEmb3: grid.tipoEmb3,
      tipoEmb4: grid.tipoEmb4,
      tipoEmb5: grid.tipoEmb5,
      tipoEmb6: grid.tipoEmb6,
      tipoEmb7: grid.tipoEmb7,
      tipoEmb8: grid.tipoEmb8,
    }));
  }

  async sendEan(brandsToSeller: GetBrandsToSeller[]) {
    const normalized = await this.onNormalizedEan(brandsToSeller);

    console.log(normalized);

    await this.sendData.post("/product/ean/import", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const whereNormalized = search ? `where ${search}` : ``;

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
        SELECT count(*) as total FROM 01010s005.dev_ean_grade e         
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
            e.produtoCod,
            e.gradeCod,
            e.gradeDescricao,
            e.sequencial,
            e.ean,
            e.qtd1,e.qtd2,e.qtd3,e.qtd4,e.qtd5,e.qtd6,e.qtd7,e.qtd8,
            e.tpEmb1,e.tpEmb2,e.tpEmb3,e.tpEmb4,e.tpEmb5,e.tpEmb6,e.tpEmb7,e.tpEmb8
          FROM 01010s005.dev_ean_grade e
          ${whereNormalized}
          limit ${limit}
          offset ${offset};
          `
        );

        await this.sendEan(itemsOrder);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
