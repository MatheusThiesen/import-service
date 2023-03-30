import "dotenv/config";
import * as cron from "node-cron";
import {
  brandImportCommerce,
  collectionImportCommerce,
  colorImportCommerce,
  groupImportCommerce,
  lineImportCommerce,
  listPriceImportCommerce,
  productImportCommerce,
  stockPromptDeliveryCommerce,
  subgroupImportCommerce,
} from "./module/commerce/useCases";
import { observableFolder } from "./module/observableFolder";

export class App {
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

  getFormatDate({
    dateType,
    minutes,
    operationType,
  }: {
    minutes: number;
    operationType: "pre" | "pos";
    dateType: "date" | "dateTime" | "time";
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

    switch (dateType) {
      case "date":
        return `${year}-${month}-${day}`;
      case "dateTime":
        return `${year}-${month}-${day}T${time}`;
      case "time":
        return time.replace(/[^a-zA-Z0-9]/g, "");
    }
  }

  async fiveMinuteExecute() {
    await Promise.all([
      productImportCommerce.execute({
        search: `p.dtAlteracao > '${this.getFormatDate({
          dateType: "date",
          minutes: 60 * 24 * 1,
          operationType: "pre",
        })}'`,
      }),
      stockPromptDeliveryCommerce.execute({
        search: `pe.dtAlteracao > '${this.getFormatDate({
          dateType: "date",
          minutes: 60 * 24 * 1,
          operationType: "pre",
        })}'`,
      }),
      // stockFutureCommerce.execute({
      //   search: `p.codigo in (
      //   select distinct produtoCod from (
      //     select i.produtoCod
      //     from 01010s005.dev_pedido_item_v2 i
      //     inner join 01010s005.dev_pedido_v2 p on p.codigo = pedidoCod
      //     where i.dtAlteracao > '${this.getFormatDate({
      //       dateType: "date",
      //       minutes: 60 * 24 * 1,
      //       operationType: "pre",
      //     })}' and i.posicaoCod in (1,3) and p.especieCod = 9

      //     union

      //     select m.produtoCod
      //     from 01010s005.dev_metas m
      //     where m.dtAlteracao > '${this.getFormatDate({
      //       dateType: "date",
      //       minutes: 60 * 24 * 1,
      //       operationType: "pre",
      //     })}'

      //   ) as analises
      // ) `,
      // }),
    ]);

    const queryFiveMinute = this.getQueryUpdateAt({ minute: 10 });
    await colorImportCommerce.execute({ search: queryFiveMinute });
    await subgroupImportCommerce.execute({ search: queryFiveMinute });
    await lineImportCommerce.execute({ search: queryFiveMinute });
    await brandImportCommerce.execute({ search: queryFiveMinute });
    await collectionImportCommerce.execute({ search: queryFiveMinute });
    await groupImportCommerce.execute({ search: queryFiveMinute });
    await listPriceImportCommerce.execute({
      search: queryFiveMinute,
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
  }
  async oneDayCron() {
    cron.schedule("0 0 */3 * * *", async () => {
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
      // await productImportCommerce.execute({
      //   search: `p.dtAlteracao > '${await this.getFormatDate({
      //     dateType: "date",
      //     minutes: 60 * 24 * 10,
      //     operationType: "pre",
      //   })}'`,
      // });
      // await stockFutureCommerce.execute({
      //   search: "m.qtdAberto > 0",
      // });
      // await stockPromptDeliveryCommerce.execute({
      //   search: "(pe.qtdFisica - pe.qtdReservada) > 0",
      // });

      await Promise.all([
        this.fiveMinuteCron(),
        observableFolder(),
        this.oneDayCron(),
        productImportCommerce.execute({
          search: `p.bloqProducao <> 2 or
          p.linhaProducao <> 0 or 
          p.bloqVenda <> 2 or 
          p.situacao <> 2`,
        }),
        stockPromptDeliveryCommerce.execute({
          search: "(pe.qtdFisica - pe.qtdReservada) > 0",
        }),

        // stockFutureCommerce.execute({
        //   // `p.codigo = 217090`,
        //   search: `p.codigo in (
        //     select distinct produtoCod
        //     from (
        //         select i.produtoCod
        //         from 01010s005.dev_pedido_item_v2 i
        //         inner join 01010s005.dev_pedido_v2 p on p.codigo = pedidoCod
        //         where i.dtAlteracao > '${this.getFormatDate({
        //           dateType: "date",
        //           minutes: 60 * 24 * 1,
        //           operationType: "pre",
        //         })}' and i.posicaoCod in (1,3) and p.especieCod = 9 and i.hrAlteracao > '${this.getFormatDate({
        //           dateType: "time",
        //           minutes: 20,
        //           operationType: "pre",
        //         })}'
        //         union
        //         select m.produtoCod
        //         from 01010s005.dev_metas m
        //         where m.dtAlteracao > '${this.getFormatDate({
        //           dateType: "date",
        //           minutes: 60 * 24 * 1,
        //           operationType: "pre",
        //         })}' and m.hrAlteracao > '${this.getFormatDate({
        //           dateType: "date",
        //           minutes: 60 * 24 * 1,
        //           operationType: "time",
        //         })}'
        //     ) as anality
        //   ) `,
        // }),
      ]);
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}

const app = new App();
app.execute();
