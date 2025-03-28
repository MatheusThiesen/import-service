import { ConceptToClient } from "src/module/entities/model/conceptsToClient";
import { dbSiger } from "../../../service/dbSiger";
import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export class ConceptToClientImportCommerce {
  readonly pagesize = 1600;

  constructor(private sendData: SendDataRepository) {}

  async onNormalized(items: ConceptToClient[]) {
    return items.map((item) => ({
      conceitoCod: item.conceitoCod,
      marcaCod: item.marcaCod,
    }));
  }

  async execute({ search }: ExecuteServiceProps) {
    try {
      const query = search
        ? `${search} AND c.conceitoCod IN (SELECT dc.conceitoCod FROM 01010s005.dev_conceito dc)`
        : "c.conceitoCod IN (SELECT dc.conceitoCod FROM 01010s005.dev_conceito dc)";

      const total = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: number }>(`
            SELECT COUNT(*) AS total FROM (
              SELECT DISTINCT c.clienteCod 
              FROM 01010s005.dev_cliente_conceito c
              WHERE ${query}
            ) AS analytic
      `)
        )[0].total
      );
      const totalPages = Math.ceil(total / this.pagesize);

      console.log({ total, totalPages });

      for (let index = 0; index < totalPages; index++) {
        const page = index;
        const limit = this.pagesize;
        const offset = this.pagesize * page;

        const clients = await dbSiger.$ExecuteQuery<{ clienteCod: number }>(`
          SELECT DISTINCT c.clienteCod 
          FROM 01010s005.dev_cliente_conceito c
          WHERE ${query}
          limit ${limit}
          offset ${offset}
        `);

        for (const client of clients) {
          const concepts = await entities.conceptsToClient.findAll({
            fields: {
              conceitoCod: true,
              marcaCod: true,
            },

            search: `c.clienteCod = ${client.clienteCod}`,
          });

          const normalized = await this.onNormalized(concepts);
          await this.sendData.post(
            `/clients/concepts/import/${client.clienteCod}`,
            normalized
          );
        }
      }
    } catch (error) {
      console.log(error);
      console.log("[CONCEPT-CLIENT][ERRO]");
    }
  }
}
