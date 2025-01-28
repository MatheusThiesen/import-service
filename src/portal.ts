import "dotenv/config";
import * as cron from "node-cron";
import { getFormatDate } from "./helpers/getFormatDate";
import {
  accessSellerNextdataViewImportPortal,
  billetViewImportPortal,
  brandViewImportPortal,
  brandsToSellerViewImportPortal,
  clientViewImportPortal,
  conceptViewImportPortal,
  eanViewImportPortal,
  gridViewImportPortal,
  groupProductViewImportPortal,
  groupsProductToSellerViewImportPortal,
  highlighterViewImportPortal,
  microregionsViewImportPortal,
  ocViewImportPortal,
  orderNotInternalCodeViewImportPortal,
  orderNotInternalCodeViewImportPortalOnly018,
  orderViewImportPortal,
  orderViewImportPortalOnly018,
  registerGroupViewImportPortal,
  sellerViewImportPortal,
  serviceInvoiceViewImportPortal,
  suspendedInvoiceViewImportPortal,
  walletSellerClientsViewImportPortal,
} from "./module/portal/useCases";

function getDateNow() {
  return new Date().toLocaleString("pt-br", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

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

  fiveMinuteCron() {
    cron.schedule("*/10 * * * *", async () => {
      console.log("[*/10 * * * *]:", getDateNow());

      try {
        await accessSellerNextdataViewImportPortal.execute({});

        await groupProductViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("g", 1, 10)}`,
        });

        await groupsProductToSellerViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("rg", 1, 10)}`,
        });

        await orderViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("rg", 1, 10)}`,
        });

        await orderNotInternalCodeViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("i", 1, 10)}`,
        });

        await brandViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("m", 1, 10)}`,
        });

        await sellerViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("r", 1, 10)} `,
        });

        await clientViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("c", 1, 10)} `,
        });

        await clientViewImportPortal.execute({
          search: `c.clienteCod in (
            select distinct e.clienteCod 
            from 01010s005.dev_cliente_email e
            where ${this.queryBuilderUpdateTime("e", 1, 10)}
          )`,
        });

        await gridViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("g", 1, 10)} `,
        });

        await eanViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("e", 1, 10)} `,
        });

        await ocViewImportPortal.execute({
          search: `oc.produtoCod in (select distinct p.codigo  from 01010s005.dev_produto p where ${this.queryBuilderUpdateTime(
            "p",
            1,
            10
          )} ) OR ${this.queryBuilderUpdateTime("oc", 1, 10)}`,
        });
        await conceptViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("c", 1, 10)}`,
        });
        await walletSellerClientsViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("cr", 1, 10)}`,
        });
        await highlighterViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("d", 1, 10)}`,
        });
        await registerGroupViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("g", 1, 10)}`,
        });
        await brandsToSellerViewImportPortal.execute({
          search: `rm.dtAlteracao > '${getFormatDate({
            dateType: "date",
            minutes: 60 * 24 * 2,
            operationType: "pre",
          })}'`,
        });
      } catch (error) {
        console.log(`[ERROR][*/10 * * * *]`, error);
      }
    });
  }

  sixtyMinuteCron() {
    cron.schedule("0 * * * *", async () => {
      console.log("[0 * * * *]:", getDateNow());

      try {
        await billetViewImportPortal.execute({});
        await microregionsViewImportPortal.execute({});
        await brandsToSellerViewImportPortal.execute({});
        await serviceInvoiceViewImportPortal.execute({
          search:
            "r.representanteCod in (2295,2306,2082,2895,1438,1493,1925,1704,2292)",
        });
        await suspendedInvoiceViewImportPortal.execute({});
      } catch (error) {
        console.log(`[ERROR][0 * * * *]`, error);
      }
    });
  }

  oneDayCron() {
    cron.schedule("0 30 22 * * *", async () => {
      console.log("[0 30 22 * * *]:", getDateNow());

      try {
        await microregionsViewImportPortal.execute({});
        await groupProductViewImportPortal.execute({});
        await groupsProductToSellerViewImportPortal.execute({});
        await orderViewImportPortal.execute({});
        await orderNotInternalCodeViewImportPortal.execute({});
        await orderViewImportPortalOnly018.execute({});
        await orderNotInternalCodeViewImportPortalOnly018.execute({});
        await brandViewImportPortal.execute({});
        await sellerViewImportPortal.execute({});
        await clientViewImportPortal.execute({});
        await gridViewImportPortal.execute({});
        await conceptViewImportPortal.execute({});
        await highlighterViewImportPortal.execute({});
        await registerGroupViewImportPortal.execute({});
        await ocViewImportPortal.execute({});
        await walletSellerClientsViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("cr", 10)}`,
        });
        await eanViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("e", 10)} `,
        });
      } catch (error) {
        console.log(`[ERROR][0 30 22 * * *]`, error);
      }
    });
  }

  async runStarted() {
    try {
      await microregionsViewImportPortal.execute({});

      await billetViewImportPortal.execute({});

      await groupProductViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("g", 3)}`,
      });

      await groupsProductToSellerViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("rg", 3)}`,
      });

      await orderViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("i", 3)}`,
      });

      await orderNotInternalCodeViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("i", 3)}`,
      });

      await orderViewImportPortalOnly018.execute({
        search: `${this.queryBuilderUpdateTime("i", 3)}`,
      });

      await orderNotInternalCodeViewImportPortalOnly018.execute({
        search: `${this.queryBuilderUpdateTime("i", 3)}`,
      });

      await brandViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("m", 3)}`,
      });

      await sellerViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("r", 3)} `,
      });

      await clientViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("c", 3)} `,
      });
      await clientViewImportPortal.execute({
        search: `c.clienteCod in (
        select distinct e.clienteCod 
        from 01010s005.dev_cliente_email e
        where ${this.queryBuilderUpdateTime("e", 3)}
      )`,
      });

      await gridViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("g", 3)} `,
      });

      await eanViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("e", 3)} `,
      });

      await ocViewImportPortal.execute({
        search: `oc.produtoCod in (select distinct p.codigo  from 01010s005.dev_produto p where ${this.queryBuilderUpdateTime(
          "p",
          3
        )} ) OR ${this.queryBuilderUpdateTime("oc", 3)}`,
      });

      await conceptViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("c", 3)}`,
      });

      await walletSellerClientsViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("cr", 3)}`,
      });

      await highlighterViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("d", 3)}`,
      });

      await registerGroupViewImportPortal.execute({
        search: `${this.queryBuilderUpdateTime("g", 3)}`,
      });

      await accessSellerNextdataViewImportPortal.execute({});

      await suspendedInvoiceViewImportPortal.execute({});
    } catch (error) {
      console.log(`[ERROR][STARTED]`, error);
    }
  }

  async execute() {
    try {
      this.fiveMinuteCron();
      this.sixtyMinuteCron();
      this.oneDayCron();

      await this.runStarted();
    } catch (err) {
      console.log(err);
    }
  }
}

const portal = new Portal();
portal.execute();
