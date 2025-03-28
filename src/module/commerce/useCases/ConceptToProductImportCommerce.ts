import { ConceptToProduct } from "../../../module/entities/model/ConceptsToProduct";
import { dbSiger } from "../../../service/dbSiger";
import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export class ConceptToProductImportCommerce {
  readonly pagesize = 1600;

  constructor(private sendData: SendDataRepository) {}

  async onNormalized(items: ConceptToProduct[]) {
    return items.map((item) => ({
      conceitoCod: item.conceitoCod,
    }));
  }

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = search ? `${search} AND p.situacao = 2` : "p.situacao = 2";

      const total = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: number }>(`
            SELECT COUNT(*) AS total FROM (
              SELECT DISTINCT p.produtoCod 
              FROM 01010s005.dev_produto_conceito p
              WHERE ${query}
            ) AS analytic
      `)
        )[0].total
      );
      const totalPages = Math.ceil(total / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;
        const limit = this.pagesize;
        const offset = this.pagesize * page;

        const products = await dbSiger.$ExecuteQuery<{ produtoCod: number }>(`
          SELECT DISTINCT p.produtoCod 
          FROM 01010s005.dev_produto_conceito p
          WHERE ${query}
          limit ${limit}
          offset ${offset}
        `);

        for (const product of products) {
          const concepts = await entities.conceptsToProduct.findAll({
            fields: {
              conceitoCod: true,
              produtoCod: true,
            },

            search: `p.produtoCod = ${product.produtoCod} AND p.situacao = 2`,
          });
          const normalized = await this.onNormalized(concepts);
          await this.sendData.post(
            `/products/concepts/import/${product.produtoCod}`,
            normalized
          );
        }
      }
    } catch (error) {
      console.log(error);
      console.log("[CONCEPT-PRODUCT][ERRO]");
    }
  }
}
