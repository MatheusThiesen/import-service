import "dotenv/config";
import * as cron from "node-cron";
import {
  brandImportCommerce,
  collectionImportCommerce,
  colorImportCommerce,
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

    const date = dateNow
      .toLocaleString("pt-br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace("-", "/")
      .replace("-", "/")
      .replace("-", "/");
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

  async oneHourExecute() {
    await colorImportCommerce.execute({});
    await subgroupImportCommerce.execute({});
    await lineImportCommerce.execute({});
    await brandImportCommerce.execute({});
    await collectionImportCommerce.execute({});
    await stockPromptDeliveryCommerce.execute({});
  }
  async oneHourCron() {
    cron.schedule("0 0 */1 * * *", async () => {
      try {
        // console.log(`[SINC-CommerceApi] 1Hour Data ${this.now()}`);

        await this.oneHourExecute();
      } catch (error) {
        console.log(error);
      }
    });
  }

  async execute() {
    try {
      await this.fiveMinuteCron();
      await this.oneHourCron();
      await observableFolder();

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
