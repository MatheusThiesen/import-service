import "dotenv/config";
import * as cron from "node-cron";
import { getFormatDate } from "./helpers/getFormatDate";
import { serverPortal } from "./module/portal/useCases";
import { queue } from "./queue";

export class Portal {
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
          entity: "accessSellerNextdataViewImportPortal",
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("g", 1, 10)}`,
          entity: "groupProductViewImportPortal",
        });
        queue.push({
          search: `${this.queryBuilderUpdateTime("rg", 1, 10)}`,
          entity: "groupsProductToSellerViewImportPortal",
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("i", 1, 10)}`,
          entity: "orderViewImportPortal",
        });
        queue.push({
          search: `${this.queryBuilderUpdateTime("i", 1, 10)}`,
          entity: "orderNotInternalCodeViewImportPortal",
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("m", 1, 10)}`,
          entity: "brandViewImportPortal",
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("r", 1, 10)} `,
          entity: "sellerViewImportPortal",
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("c", 1, 10)} `,
          entity: "clientViewImportPortal",
        });

        queue.push({
          search: `c.clienteCod in (
                      select distinct e.clienteCod 
                      from 01010s005.dev_cliente_email e
	                    where ${this.queryBuilderUpdateTime("e", 1, 10)}
                    )`,
          entity: "clientViewImportPortal",
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("g", 1, 10)} `,
          entity: "gridViewImportPortal",
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("e", 1, 10)} `,
          entity: "eanViewImportPortal",
        });

        queue.push({
          entity: "ocViewImportPortal",
          search: `oc.produtoCod in (select distinct p.codigo  from 01010s005.dev_produto p where ${this.queryBuilderUpdateTime(
            "p",
            1,
            10
          )} ) OR ${this.queryBuilderUpdateTime("oc", 1, 10)}`,
        });

        queue.push({
          entity: "conceptViewImportPortal",
          search: `${this.queryBuilderUpdateTime("c", 1, 10)}`,
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("cr", 1, 10)}`,
          entity: "walletSellerClientsViewImportPortal",
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("d", 1, 10)}`,
          entity: "highlighterViewImportPortal",
        });

        queue.push({
          entity: "registerGroupViewImportPortal",
          search: `${this.queryBuilderUpdateTime("g", 1, 10)}`,
        });

        queue.push({
          entity: "brandsToSellerViewImportPortal",
          search: `rm.dtAlteracao > '${getFormatDate({
            dateType: "date",
            minutes: 60 * 24 * 2,
            operationType: "pre",
          })}'`,
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async sixtyMinuteCron() {
    cron.schedule("0 */60 * * * *", async () => {
      try {
        queue.push({
          entity: "brandsToSellerViewImportPortal",
        });

        queue.push({
          entity: "serviceInvoiceViewImportPortal",
          search:
            "r.representanteCod in (2295,2306,2082,2895,1438,1493,1925,1704,2292)",
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async thereHoursCron() {
    cron.schedule("50 3 */2 * * *", async () => {
      try {
        queue.push({
          entity: "billetViewImportPortal",
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async oneDayCron() {
    cron.schedule("0 30 */22 * * *", async () => {
      try {
        queue.push({
          entity: "groupProductViewImportPortal",
        });
        queue.push({
          entity: "groupsProductToSellerViewImportPortal",
        });
        queue.push({
          entity: "orderViewImportPortal",
        });
        queue.push({
          entity: "orderNotInternalCodeViewImportPortal",
        });
        queue.push({
          entity: "orderViewImportPortalOnly018",
        });
        queue.push({
          entity: "orderNotInternalCodeViewImportPortalOnly018",
        });
        queue.push({
          entity: "brandViewImportPortal",
        });
        queue.push({
          entity: "sellerViewImportPortal",
        });
        queue.push({
          entity: "clientViewImportPortal",
        });
        queue.push({
          entity: "gridViewImportPortal",
        });
        queue.push({
          entity: "conceptViewImportPortal",
        });
        queue.push({
          entity: "highlighterViewImportPortal",
        });
        queue.push({
          entity: "registerGroupViewImportPortal",
        });
        queue.push({
          entity: "ocViewImportPortal",
        });
        queue.push({
          search: `${this.queryBuilderUpdateTime("cr", 3)}`,
          entity: "walletSellerClientsViewImportPortal",
        });
        queue.push({
          search: `${this.queryBuilderUpdateTime("e", 3)} `,
          entity: "eanViewImportPortal",
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async execute() {
    try {
      queue.push({
        search: `${this.queryBuilderUpdateTime("g", 3)}`,
        entity: "groupProductViewImportPortal",
      });
      queue.push({
        search: `${this.queryBuilderUpdateTime("rg", 3)}`,
        entity: "groupsProductToSellerViewImportPortal",
      });

      queue.push({
        search: `${this.queryBuilderUpdateTime("i", 3)}`,
        entity: "orderViewImportPortal",
      });
      queue.push({
        search: `${this.queryBuilderUpdateTime("i", 3)}`,
        entity: "orderNotInternalCodeViewImportPortal",
      });

      queue.push({
        search: `${this.queryBuilderUpdateTime("m", 3)}`,
        entity: "brandViewImportPortal",
      });

      queue.push({
        search: `${this.queryBuilderUpdateTime("r", 3)} `,
        entity: "sellerViewImportPortal",
      });

      queue.push({
        search: `${this.queryBuilderUpdateTime("c", 3)} `,
        entity: "clientViewImportPortal",
      });

      queue.push({
        search: `c.clienteCod in (
                    select distinct e.clienteCod 
                    from 01010s005.dev_cliente_email e
                    where ${this.queryBuilderUpdateTime("e", 3)}
                  )`,
        entity: "clientViewImportPortal",
      });

      queue.push({
        search: `${this.queryBuilderUpdateTime("g", 3)} `,
        entity: "gridViewImportPortal",
      });

      queue.push({
        search: `${this.queryBuilderUpdateTime("e", 3)} `,
        entity: "eanViewImportPortal",
      });

      queue.push({
        entity: "ocViewImportPortal",
        search: `oc.produtoCod in (select distinct p.codigo  from 01010s005.dev_produto p where ${this.queryBuilderUpdateTime(
          "p",
          3
        )} ) OR ${this.queryBuilderUpdateTime("oc", 3)}`,
      });

      queue.push({
        entity: "conceptViewImportPortal",
        search: `${this.queryBuilderUpdateTime("c", 3)}`,
      });

      queue.push({
        search: `${this.queryBuilderUpdateTime("cr", 3)}`,
        entity: "walletSellerClientsViewImportPortal",
      });

      queue.push({
        search: `${this.queryBuilderUpdateTime("d", 3)}`,
        entity: "highlighterViewImportPortal",
      });

      queue.push({
        entity: "registerGroupViewImportPortal",
        search: `${this.queryBuilderUpdateTime("g", 3)}`,
      });

      queue.push({
        entity: "accessSellerNextdataViewImportPortal",
      });

      await Promise.all([
        serverPortal.execute(),
        this.fiveMinuteCron(),
        this.oneDayCron(),
        this.sixtyMinuteCron(),
        this.thereHoursCron(),
      ]);
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}

const portal = new Portal();
portal.execute();
