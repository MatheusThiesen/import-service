import * as cron from "node-cron";
import { concepts, productConceptRules, products } from "./useCases";

export async function executeEntities() {
  //Produtos
  await products.execute();
  //Conceito
  await concepts.execute();
  //Regra de Produto Conceito
  await productConceptRules.execute();
}

export async function observableFolder() {
  await executeEntities();

  cron.schedule("0 */1 * * * *", async () => {
    try {
      const now = new Date().toLocaleString("pt-br", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      console.log(`[SINC-ObservableFolder] 1min Data ${now}`);
      await executeEntities();
    } catch (error) {
      console.log("[INDEX] error");
    }
  });
}
