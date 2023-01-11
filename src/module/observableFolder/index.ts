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
      await executeEntities();
    } catch (error) {
      console.log("[INDEX] error");
    }
  });
}
