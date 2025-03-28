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
        await Promise.all([
          accessSellerNextdataViewImportPortal.execute({}),
          groupProductViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("g", 1, 10)}`,
          }),
          groupsProductToSellerViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("rg", 1, 10)}`,
          }),
          orderViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("i", 1, 10)}`,
          }),
          orderNotInternalCodeViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("i", 1, 10)}`,
          }),
          brandViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("m", 1, 10)}`,
          }),
          sellerViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("r", 1, 10)} `,
          }),
          clientViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("c", 1, 10)} `,
          }),
          clientViewImportPortal.execute({
            search: `c.clienteCod in (
              select distinct e.clienteCod 
              from 01010s005.dev_cliente_email e
              where ${this.queryBuilderUpdateTime("e", 1, 10)}
            )`,
          }),
          gridViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("g", 1, 10)} `,
          }),
          eanViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("e", 1, 10)} `,
          }),
          ocViewImportPortal.execute({
            search: `oc.produtoCod in (select distinct p.codigo  from 01010s005.dev_produto p where ${this.queryBuilderUpdateTime(
              "p",
              1,
              10
            )} ) OR ${this.queryBuilderUpdateTime("oc", 1, 10)}`,
          }),
          conceptViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("c", 1, 10)}`,
          }),
          walletSellerClientsViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("cr", 1, 10)}`,
          }),
          highlighterViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("d", 1, 10)}`,
          }),
          registerGroupViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("g", 1, 10)}`,
          }),
          brandsToSellerViewImportPortal.execute({
            search: `rm.dtAlteracao > '${getFormatDate({
              dateType: "date",
              minutes: 60 * 24 * 2,
              operationType: "pre",
            })}'`,
          }),
        ]);
      } catch (error) {
        console.log(`[ERROR][*/10 * * * *]`, error);
      }
    });
  }

  sixtyMinuteCron() {
    cron.schedule("0 * * * *", async () => {
      console.log("[0 * * * *]:", getDateNow());

      try {
        await Promise.all([
          billetViewImportPortal.execute({}),
          microregionsViewImportPortal.execute({}),
          brandsToSellerViewImportPortal.execute({}),
          serviceInvoiceViewImportPortal.execute({
            search:
              "r.representanteCod in (2295,2306,2082,2895,1438,1493,1925,1704,2292)",
          }),
          suspendedInvoiceViewImportPortal.execute({}),
        ]);
      } catch (error) {
        console.log(`[ERROR][0 * * * *]`, error);
      }
    });
  }

  oneDayCron() {
    cron.schedule("0 30 22 * * *", async () => {
      console.log("[0 30 22 * * *]:", getDateNow());

      try {
        await Promise.all([
          microregionsViewImportPortal.execute({}),
          groupProductViewImportPortal.execute({}),
          groupsProductToSellerViewImportPortal.execute({}),
          orderViewImportPortal.execute({}),
          orderNotInternalCodeViewImportPortal.execute({}),
          orderViewImportPortalOnly018.execute({}),
          orderNotInternalCodeViewImportPortalOnly018.execute({}),
          brandViewImportPortal.execute({}),
          sellerViewImportPortal.execute({}),
          clientViewImportPortal.execute({}),
          gridViewImportPortal.execute({}),
          conceptViewImportPortal.execute({}),
          highlighterViewImportPortal.execute({}),
          registerGroupViewImportPortal.execute({}),
          ocViewImportPortal.execute({}),
          walletSellerClientsViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("cr", 10)}`,
          }),
          eanViewImportPortal.execute({
            search: `${this.queryBuilderUpdateTime("e", 10)} `,
          }),
        ]);
      } catch (error) {
        console.log(`[ERROR][0 30 22 * * *]`, error);
      }
    });
  }

  async runStarted() {
    try {
      await Promise.all([
        microregionsViewImportPortal.execute({}),
        billetViewImportPortal.execute({}),
        groupProductViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("g", 3)}`,
        }),
        groupsProductToSellerViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("rg", 3)}`,
        }),
        orderViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("i", 3)}`,
        }),
        orderNotInternalCodeViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("i", 3)}`,
        }),
        orderViewImportPortalOnly018.execute({
          search: `${this.queryBuilderUpdateTime("i", 3)}`,
        }),
        orderNotInternalCodeViewImportPortalOnly018.execute({
          search: `${this.queryBuilderUpdateTime("i", 3)}`,
        }),
        brandViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("m", 3)}`,
        }),
        sellerViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("r", 3)} `,
        }),
        clientViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("c", 3)} `,
        }),
        clientViewImportPortal.execute({
          search: `c.clienteCod in (
          select distinct e.clienteCod 
          from 01010s005.dev_cliente_email e
          where ${this.queryBuilderUpdateTime("e", 3)}
        )`,
        }),
        gridViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("g", 3)} `,
        }),
        eanViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("e", 3)} `,
        }),
        ocViewImportPortal.execute({
          search: `oc.produtoCod in (select distinct p.codigo  from 01010s005.dev_produto p where ${this.queryBuilderUpdateTime(
            "p",
            3
          )} ) OR ${this.queryBuilderUpdateTime("oc", 3)}`,
        }),
        conceptViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("c", 3)}`,
        }),
        walletSellerClientsViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("cr", 3)}`,
        }),
        highlighterViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("d", 3)}`,
        }),
        registerGroupViewImportPortal.execute({
          search: `${this.queryBuilderUpdateTime("g", 3)}`,
        }),
        accessSellerNextdataViewImportPortal.execute({}),
        suspendedInvoiceViewImportPortal.execute({}),
      ]);
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
