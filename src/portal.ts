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
          search: `${this.queryBuilderUpdateTime("i", 1, 10)}`,
          entity: "orderViewImportPortal",
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
          search: `${this.queryBuilderUpdateTime("g", 1, 10)} `,
          entity: "gridViewImportPortal",
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("e", 1, 10)} `,
          entity: "eanViewImportPortal",
        });

        queue.push({
          search: `${this.queryBuilderUpdateTime("n", 1)} `,
          entity: "noteOrderViewImportPortal",
        });

        queue.push({
          entity: "conceptViewImportPortal",
          search: `${this.queryBuilderUpdateTime("c", 1, 10)}`,
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
          entity: "orderViewImportPortal",
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
          search: `${this.queryBuilderUpdateTime("e", 3)} `,
          entity: "eanViewImportPortal",
        });
        queue.push({
          search: `${this.queryBuilderUpdateTime("n", 10)} `,
          entity: "noteOrderViewImportPortal",
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async execute() {
    try {
      // console.time()
      // console.timeEnd()

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
