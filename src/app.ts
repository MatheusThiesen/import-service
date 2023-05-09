import "dotenv/config";
import * as cron from "node-cron";
import { getFormatDate } from "./helpers/getFormatDate";
import { observableFolder } from "./module/observableFolder";
import { queue } from "./queue";

export class App {
  queryBuilderUpdateTime(initial: string, days: number, minutes?: number) {
    if (minutes) {
      return `${initial}.dtAlteracao > '${getFormatDate({
        dateType: "date",
        minutes: 60 * 24 * days,
        operationType: "pre",
      })}' and  ${initial}.hrAlteracao > ${getFormatDate({
        dateType: "time",
        minutes: minutes,
        operationType: "pre",
      })}`;
    } else {
      return `${initial}.dtAlteracao > '${getFormatDate({
        dateType: "date",
        minutes: 60 * 24 * days,
        operationType: "pre",
      })}'`;
    }
  }

  async fiveMinuteCron() {
    cron.schedule("0 */10 * * * *", async () => {
      try {
        queue.push({
          entity: "branchActivistsImportCommerce",
          search: `${this.queryBuilderUpdateTime("g", 1, 10)}`,
        });
        queue.push({
          entity: "clientImportCommerce",
          search: `${this.queryBuilderUpdateTime("c", 1, 10)}`,
        });
        queue.push({
          entity: "walletSellerClientImportCommerce",
          search: `${this.queryBuilderUpdateTime("cr", 1, 10)}`,
        });
        queue.push({
          entity: "sellerImportCommerce",
          search: `${this.queryBuilderUpdateTime("r", 1, 10)}`,
        });
        queue.push({
          entity: "conceptImportCommerce",
          search: `${this.queryBuilderUpdateTime("c", 1, 10)}`,
        });
        queue.push({
          entity: "brandImportCommerce",
          search: `${this.queryBuilderUpdateTime("m", 1, 10)}`,
        });
        queue.push({
          entity: "collectionImportCommerce",
          search: `${this.queryBuilderUpdateTime("c", 1, 10)}`,
        });
        queue.push({
          entity: "colorImportCommerce",
          search: `${this.queryBuilderUpdateTime("c", 1, 10)}`,
        });
        queue.push({
          entity: "groupImportCommerce",
          search: `${this.queryBuilderUpdateTime("g", 1, 10)}`,
        });
        queue.push({
          entity: "lineImportCommerce",
          search: `${this.queryBuilderUpdateTime("l", 1, 10)}`,
        });
        queue.push({
          entity: "subGroupImportCommerce",
          search: `${this.queryBuilderUpdateTime("s", 1, 10)}`,
        });
        queue.push({
          entity: "listPriceImportCommerce",
          search: `${this.queryBuilderUpdateTime("l", 1, 10)}`,
        });
        queue.push({
          entity: "productImportCommerce",
          search: `${this.queryBuilderUpdateTime("p", 1, 10)}`,
        });
        queue.push({
          entity: "stockPromptDeliveryCommerce",
          search: `${this.queryBuilderUpdateTime("pe", 1, 10)}`,
        });
        queue.push({
          entity: "stockFutureCommerce",
          search: `
          p.codigo in (
            select distinct produtoCod from (
              select i.produtoCod
              from 01010s005.dev_pedido_item_v2 i
              inner join 01010s005.dev_pedido_v2 p on p.codigo = pedidoCod
              where ${this.queryBuilderUpdateTime(
                "i",
                1,
                10
              )} and i.posicaoCod in (1,3) and p.especieCod = 9

              union

              select m.produtoCod
              from 01010s005.dev_metas m
              where ${this.queryBuilderUpdateTime("m", 1, 10)}

            ) as analises
          ) `,
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async thirtyMinuteCron() {
    cron.schedule("0 */29 * * * *", async () => {
      try {
        queue.push({
          entity: "brandsToSellerImportCommerce",
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async oneDayCron() {
    cron.schedule("0 0 */3 * * *", async () => {
      try {
        queue.push({
          entity: "sellerImportCommerce",
        });
        queue.push({
          entity: "conceptImportCommerce",
        });
        queue.push({
          entity: "brandImportCommerce",
        });
        queue.push({
          entity: "collectionImportCommerce",
        });
        queue.push({
          entity: "colorImportCommerce",
        });
        queue.push({
          entity: "groupImportCommerce",
        });
        queue.push({
          entity: "lineImportCommerce",
        });
        queue.push({
          entity: "subGroupImportCommerce",
        });
        queue.push({
          entity: "branchActivistsImportCommerce",
        });
        queue.push({
          entity: "walletSellerClientImportCommerce",
        });
        queue.push({
          entity: "clientImportCommerce",
          search: `${this.queryBuilderUpdateTime("c", 10)}`,
        });

        queue.push({
          entity: "listPriceImportCommerce",
          search: `${this.queryBuilderUpdateTime("l", 2)}`,
        });
        queue.push({
          entity: "productImportCommerce",
          search: `${this.queryBuilderUpdateTime("p", 3)}`,
        });
        queue.push({
          entity: "stockPromptDeliveryCommerce",
        });
        queue.push({
          entity: "stockFutureCommerce",
          search: `
          p.codigo in (
            select distinct produtoCod from (
              select i.produtoCod
              from 01010s005.dev_pedido_item_v2 i
              inner join 01010s005.dev_pedido_v2 p on p.codigo = pedidoCod
              where ${this.queryBuilderUpdateTime(
                "i",
                2
              )} and i.posicaoCod in (1,3) and p.especieCod = 9

              union

              select m.produtoCod
              from 01010s005.dev_metas m
              where ${this.queryBuilderUpdateTime("m", 2)}

            ) as analises
          ) `,
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async execute() {
    try {
      await Promise.all([
        observableFolder(),
        this.fiveMinuteCron(),
        this.thirtyMinuteCron(),
        this.oneDayCron(),
      ]);
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}

const app = new App();
app.execute();

// queue.push({
//   entity: "stockPromptDeliveryCommerce",
//   search: "(pe.qtdFisica - pe.qtdReservada) > 0",
// });

// queue.push({
//   entity: "stockFutureCommerce",
//   search: `
//   p.codigo in (
//     select distinct produtoCod from (
//       select i.produtoCod
//       from 01010s005.dev_pedido_item_v2 i
//       inner join 01010s005.dev_pedido_v2 p on p.codigo = pedidoCod
//       where ${this.queryBuilderUpdateTime(
//         "i",
//         2
//       )} and i.posicaoCod in (1,3) and p.especieCod = 9

//       union

//       select m.produtoCod
//       from 01010s005.dev_metas m
//       where ${this.queryBuilderUpdateTime("m", 2)}

//     ) as analises
//   ) `,
// });
