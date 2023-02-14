import "dotenv/config";
import * as cron from "node-cron";
import { orderViewImportPortal } from "./module/portal/useCases";

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
      minutes: 60 * 24,
      operationType: "pre",
    })}'`;

    await orderViewImportPortal.execute({
      search: query,
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

  async twoDayExecute() {
    const query = `p.dtEntrada > '${await this.getFormatDate({
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
      // search: "p.codigo = 1249226",
      search: query,
    });
  }

  async twoDayCron() {
    cron.schedule("0 30 */23,*/12  * * *", async () => {
      try {
        await this.twoDayExecute();
      } catch (error) {
        console.log(error);
      }
    });
  }

  async execute() {
    try {
      await this.fiveMinuteCron();
      await this.twoDayCron();
      await this.fiveMinuteExecute();
      // await this.twoDayExecute();
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}
