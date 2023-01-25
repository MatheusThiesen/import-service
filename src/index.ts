import "dotenv/config";
import * as cron from "node-cron";
import {
  brandImportCommerce,
  collectionImportCommerce,
  colorImportCommerce,
  groupImportCommerce,
  lineImportCommerce,
  orderItemImportCommerce,
  purchaseOrderCommerce,
  stockPromptDeliveryCommerce,
  subgroupImportCommerce,
} from "./module/commerce/useCases";
import { observableFolder } from "./module/observableFolder";

class App {
  now() {
    return new Date().toLocaleString("pt-br", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  getQueryUpdateAt({
    minute,
    dateLabel = "lastChangeDate",
    timeLabel = "lastChangeTime",
  }: {
    minute: number;
    dateLabel?: string;
    timeLabel?: string;
  }) {
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() - minute);

    const day = dateNow.toLocaleString("pt-br", {
      day: "2-digit",
    });

    const month = dateNow.toLocaleString("pt-br", {
      month: "2-digit",
    });

    const year = dateNow.toLocaleString("pt-br", {
      year: "numeric",
    });

    const date = `${day}/${month}/${year}`;

    const time = dateNow
      .toLocaleString("pt-br", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(":", "")
      .replace(":", "")
      .replace(":", "");

    return `${dateLabel} EQ "${date}" AND ${timeLabel} GTE ${time}`;
  }

  async fiveMinuteExecute() {
    const queryFiveMinute = this.getQueryUpdateAt({ minute: 10 });
    await colorImportCommerce.execute({ search: queryFiveMinute });
    await subgroupImportCommerce.execute({ search: queryFiveMinute });
    await lineImportCommerce.execute({ search: queryFiveMinute });
    await brandImportCommerce.execute({ search: queryFiveMinute });
    await collectionImportCommerce.execute({ search: queryFiveMinute });
    await groupImportCommerce.execute({ search: queryFiveMinute });
    await stockPromptDeliveryCommerce.execute({
      search: queryFiveMinute,
    });
    await orderItemImportCommerce.execute({
      search: queryFiveMinute,
    });

    const queryFiveMinuteAlterLabel = this.getQueryUpdateAt({
      minute: 10,
      dateLabel: "lastRegistryChangeDate",
      timeLabel: "lastRegistryChangeTime",
    });

    await purchaseOrderCommerce.execute({
      search: queryFiveMinuteAlterLabel,
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
    const dayCalc = 60 * 24;

    const queryDay = this.getQueryUpdateAt({ minute: dayCalc });
    await colorImportCommerce.execute({ search: queryDay });
    await subgroupImportCommerce.execute({ search: queryDay });
    await lineImportCommerce.execute({ search: queryDay });
    await brandImportCommerce.execute({ search: queryDay });
    await collectionImportCommerce.execute({ search: queryDay });
    await groupImportCommerce.execute({ search: queryDay });
    await stockPromptDeliveryCommerce.execute({
      search: queryDay,
    });
    await orderItemImportCommerce.execute({
      search: queryDay,
    });

    const queryDayAlterLabel = this.getQueryUpdateAt({
      minute: dayCalc,
      dateLabel: "lastRegistryChangeDate",
      timeLabel: "lastRegistryChangeTime",
    });

    await purchaseOrderCommerce.execute({
      search: queryDayAlterLabel,
    });
  }
  async oneDayCron() {
    cron.schedule("0 59 */23 * * *", async () => {
      try {
        // console.log(`[SINC-CommerceApi] 1Hour Data ${this.now()}`);

        await this.oneDayExecute();
      } catch (error) {
        console.log(error);
      }
    });
  }

  async execute() {
    try {
      await this.fiveMinuteCron();
      await observableFolder();
      await this.oneDayCron();

      // const queryOrderItem = `entryDate GTE "01/10/2021" AND order.positionOrder IN (2,3)`;
      // const queryPurchaseOrder = `product.situation IN (2) AND deliveryDeadlineDate GT "01/01/2023" AND itemStatus IN (2)`;

      // await purchaseOrderCommerce.execute({
      //   search: queryPurchaseOrder,
      // });
      // await orderItemImportCommerce.execute({
      //   search: queryOrderItem,
      // });
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}

const app = new App();
app.execute();
