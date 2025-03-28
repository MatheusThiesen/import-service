import "dotenv/config";
import * as cron from "node-cron";

import { getFormatDate } from "./helpers/getFormatDate";
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

  async threeMinuteCron() {
    cron.schedule(
      "0 */2 * * * *",
      async () => {
        try {
          queue.push({
            entity: "stockPromptDeliveryCommerce",
            search: `${this.queryBuilderUpdateTime("pe", 1, 5)}`,
          });
          queue.push({
            entity: "stockFutureCommerce",
            search: `${this.queryBuilderUpdateTime("c", 1, 5)}`,
          });
          queue.push({
            entity: "orderImportCommerce",
            search: `${this.queryBuilderUpdateTime("p", 1, 5)}`,
          });
          queue.push({
            entity: "walletSellerClientImportCommerce",
            search: `
              r.representanteCod in (
                select cr.representanteCod from 01010s005.dev_cliente_representante cr
                where ${this.queryBuilderUpdateTime("cr", 1, 5)}
              ) and r.representanteCod != 1
            `,
          });
        } catch (error) {
          console.log(error);
        }
      },
      {
        timezone: "America/Sao_Paulo",
      }
    );
  }

  async tenMinuteCron() {
    cron.schedule(
      "0 */10 * * * *",
      async () => {
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
            entity: "productImageImportCommerce",
            search: `${this.queryBuilderUpdateTime("i", 1, 10)}`,
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
            search: `${this.queryBuilderUpdateTime("c", 1, 10)}`,
          });
          queue.push({
            entity: "orderImportCommerce",
            search: `${this.queryBuilderUpdateTime("p", 1, 10)}`,
          });
          queue.push({
            entity: "billingLocationImportCommerce",
            search: `${this.queryBuilderUpdateTime("l", 1, 10)}`,
          });
          queue.push({
            entity: "tablePriceImportCommerce",
            search: `${this.queryBuilderUpdateTime("p", 1, 10)}`,
          });
          queue.push({
            entity: "paymentConditionImportCommerce",
            search: `${this.queryBuilderUpdateTime("p", 1, 10)}`,
          });
          queue.push({
            entity: "blockGroupProductToSellerImportCommerce",
            search: `r.representanteCod in (
                select distinct rg.representanteCod 
                from 01010s005.DEV_REPRESENTATE_GRUPO rg
                where ${this.queryBuilderUpdateTime("rg", 1)}
              )`,
          });
          queue.push({
            entity: "conceptToProductImportCommerce",
            search: `${this.queryBuilderUpdateTime("p", 1, 10)}`,
          });
          queue.push({
            entity: "conceptToClientImportCommerce",
            search: `${this.queryBuilderUpdateTime("c", 1, 10)}`,
          });
        } catch (error) {
          console.log(error);
        }
      },
      {
        timezone: "America/Sao_Paulo",
      }
    );
  }

  async thirtyMinuteCron() {
    cron.schedule("0 */29 * * * *", async () => {
      try {
        queue.push({
          entity: "brandsToSellerImportCommerce",
        });
        queue.push({
          entity: "billetImportCommerce",
          search: `${this.queryBuilderUpdateTime("t", 1)}`,
        });
        queue.push({
          entity: "stockPromptDeliveryCommerce",
          search: "(pe.qtdFisica - pe.qtdReservada) > 0",
        });
        queue.push({
          entity: "stockFutureCommerce",
          search: "c.saldo > 0",
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async fortyMinuteCron() {
    cron.schedule("0 */45 * * * *", async () => {
      try {
        queue.push({
          entity: "stockPromptDeliveryCommerce",
          search: "(pe.qtdFisica - pe.qtdReservada) > 0",
        });

        queue.push({
          entity: "stockFutureCommerce",
          search: "c.saldo > 0",
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async oneDayCron() {
    cron.schedule(
      "0 0 1 * * *",
      async () => {
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
            entity: "billetImportCommerce",
          });
          queue.push({
            entity: "billingLocationImportCommerce",
          });
          queue.push({
            entity: "tablePriceImportCommerce",
          });
          queue.push({
            entity: "paymentConditionImportCommerce",
          });
          queue.push({
            entity: "clientImportCommerce",
          });
          queue.push({
            entity: "walletSellerClientImportCommerce",
          });
          queue.push({
            entity: "listPriceImportCommerce",
            search: `${this.queryBuilderUpdateTime("l", 10)}`,
          });
          queue.push({
            entity: "productImportCommerce",
            search: `${this.queryBuilderUpdateTime("p", 10)}`,
          });
          queue.push({
            entity: "productImageImportCommerce",
            search: `${this.queryBuilderUpdateTime("i", 10)}`,
          });
          queue.push({
            entity: "orderImportCommerce",
            search: `${this.queryBuilderUpdateTime("p", 10)}`,
          });
          queue.push({
            entity: "blockGroupProductToSellerImportCommerce",
          });
          queue.push({
            entity: "conceptToProductImportCommerce",
            search: `${this.queryBuilderUpdateTime("p", 10)}`,
          });
          queue.push({
            entity: "conceptToClientImportCommerce",
            search: `${this.queryBuilderUpdateTime("c", 10)}`,
          });
        } catch (error) {
          console.log(error);
        }
      },
      {
        timezone: "America/Sao_Paulo",
      }
    );
  }

  async execute() {
    try {
      await Promise.all([
        this.threeMinuteCron(),
        this.tenMinuteCron(),
        this.thirtyMinuteCron(),
        this.oneDayCron(),
      ]);

      queue.push({
        entity: "stockPromptDeliveryCommerce",
        search: "(pe.qtdFisica - pe.qtdReservada) > 0",
      });
      queue.push({
        entity: "stockFutureCommerce",
        search: "c.saldo > 0",
      });
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
        entity: "billetImportCommerce",
      });
      queue.push({
        entity: "billingLocationImportCommerce",
      });
      queue.push({
        entity: "tablePriceImportCommerce",
      });
      queue.push({
        entity: "paymentConditionImportCommerce",
      });
      queue.push({
        entity: "clientImportCommerce",
      });
      queue.push({
        entity: "walletSellerClientImportCommerce",
      });
      queue.push({
        entity: "blockGroupProductToSellerImportCommerce",
      });
      queue.push({
        entity: "orderImportCommerce",
        search: `${this.queryBuilderUpdateTime("p", 10)}`,
      });
      queue.push({
        entity: "listPriceImportCommerce",
        search: `${this.queryBuilderUpdateTime("l", 10)}`,
      });
      queue.push({
        entity: "productImportCommerce",
        search: `${this.queryBuilderUpdateTime("p", 10)}`,
      });
      queue.push({
        entity: "productImageImportCommerce",
        search: `${this.queryBuilderUpdateTime("i", 10)}`,
      });
      queue.push({
        entity: "conceptToProductImportCommerce",
        search: `${this.queryBuilderUpdateTime("p", 10)}`,
      });
      queue.push({
        entity: "conceptToClientImportCommerce",
        search: `${this.queryBuilderUpdateTime("c", 10)}`,
      });
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
//   search: "c.saldo > 0",
// });
