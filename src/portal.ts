import "dotenv/config";
import * as cron from "node-cron";
import {
  billetViewImportPortal,
  brandViewImportPortal,
  clientViewImportPortal,
  orderViewImportPortal,
  sellerViewImportPortal,
  serverPortal,
} from "./module/portal/useCases";

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

    await orderViewImportPortal.execute({
      search: query,
    });

    await brandViewImportPortal.execute({
      search: `m.dtAlteracao > '${await this.getFormatDate({
        dateType: "date",
        minutes: 60 * 24 * 2,
        operationType: "pre",
      })}'`,
    });

    await sellerViewImportPortal.execute({
      search: `r.dtAlteracao > '${await this.getFormatDate({
        dateType: "date",
        minutes: 60 * 24 * 2,
        operationType: "pre",
      })}'`,
    });

    await clientViewImportPortal.execute({
      search: `c.dtAlteracao > '${await this.getFormatDate({
        dateType: "date",
        minutes: 60 * 24 * 2,
        operationType: "pre",
      })}'`,
    });

    await billetViewImportPortal.execute({
      search: `t.dtAlteracao > '${await this.getFormatDate({
        dateType: "date",
        minutes: 60 * 24 * 2,
        operationType: "pre",
      })}'`,
    });
  }

  async fiveMinuteCron() {
    cron.schedule("0 */5 * * * *", async () => {
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

    await orderViewImportPortal.execute({
      search: queryOrder,
    });

    await brandViewImportPortal.execute({});
    await sellerViewImportPortal.execute({});
    await clientViewImportPortal.execute({});
    await billetViewImportPortal.execute({});
  }

  async oneDayCron() {
    cron.schedule("0 30 */23 * * *", async () => {
      try {
        await this.oneDayExecute();
      } catch (error) {
        console.log(error);
      }
    });
  }

  async execute() {
    try {
      await this.fiveMinuteCron();
      await this.fiveMinuteExecute();

      await serverPortal.execute();
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}

const portal = new Portal();
portal.execute();
