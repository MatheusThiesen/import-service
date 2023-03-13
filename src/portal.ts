import "dotenv/config";
import * as cron from "node-cron";
import { serverPortal } from "./module/portal/useCases";
import { queue } from "./queue";

export class Portal {
  async getFormatDate({
    dateType,
    minutes,
    operationType,
  }: {
    minutes: number;
    operationType: "pre" | "pos";
    dateType: "date" | "dateTime";
  }) {
    const dateNow = new Date();

    if (operationType === "pre") {
      dateNow.setMinutes(dateNow.getMinutes() - minutes);
    } else {
      dateNow.setMinutes(dateNow.getMinutes() + minutes);
    }

    const day = dateNow.toLocaleString("pt-br", {
      day: "2-digit",
    });

    const month = dateNow.toLocaleString("pt-br", {
      month: "2-digit",
    });

    const year = dateNow.toLocaleString("pt-br", {
      year: "numeric",
    });

    const time = dateNow.toLocaleString("pt-br", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    if (dateType === "date") {
      return `${year}-${month}-${day}`;
    } else {
      return `${year}-${month}-${day}T${time}`;
    }
  }

  async fiveMinuteExecute() {
    const query = `p.dtAlteracao > '${await this.getFormatDate({
      dateType: "date",
      minutes: 60 * 24 * 2,
      operationType: "pre",
    })}'`;

    queue.push({
      search: query,
      entity: "orderViewImportPortal",
    });

    queue.push({
      search: `m.dtAlteracao > '${await this.getFormatDate({
        dateType: "date",
        minutes: 60 * 24 * 2,
        operationType: "pre",
      })}'`,
      entity: "brandViewImportPortal",
    });

    queue.push({
      search: `r.dtAlteracao > '${await this.getFormatDate({
        dateType: "date",
        minutes: 60 * 24 * 2,
        operationType: "pre",
      })}'`,
      entity: "sellerViewImportPortal",
    });

    queue.push({
      search: `c.dtAlteracao > '${await this.getFormatDate({
        dateType: "date",
        minutes: 60 * 24 * 2,
        operationType: "pre",
      })}'`,
      entity: "clientViewImportPortal",
    });

    queue.push({
      search: `t.dtAlteracao > '${await this.getFormatDate({
        dateType: "date",
        minutes: 60 * 24 * 2,
        operationType: "pre",
      })}'`,
      entity: "billetViewImportPortal",
    });
  }

  async fiveMinuteCron() {
    cron.schedule("0 */20 * * * *", async () => {
      try {
        await this.fiveMinuteExecute();
      } catch (error) {
        console.log(error);
      }
    });
  }

  async oneDayExecute() {
    const queryOrder = `p.dtEntrada > '${await this.getFormatDate({
      dateType: "date",
      minutes: 60 * 24 * 365,
      operationType: "pre",
    })}' AND p.dtFaturamento < '${await this.getFormatDate({
      dateType: "date",
      minutes: 60 * 24 * 365,
      operationType: "pos",
    })}'
    `;

    queue.push({
      search: queryOrder,
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
      entity: "billetViewImportPortal",
    });
  }

  async oneDayCron() {
    cron.schedule("0 30 */22 * * *", async () => {
      try {
        await this.oneDayExecute();
      } catch (error) {
        console.log(error);
      }
    });
  }

  async execute() {
    try {
      await serverPortal.execute();
      await this.fiveMinuteCron();
      await this.oneDayCron();
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}

const portal = new Portal();
portal.execute();
