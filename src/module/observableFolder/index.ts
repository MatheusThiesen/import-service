import * as cron from "node-cron";
import {
  concepts,
  productConceptRules,
  products,
  purchasesOrder,
  stocksPromptDelivery,
} from "./useCases";

export async function executeEntities() {
  //Produtos
  await products.execute();
  //Conceito
  await concepts.execute();
  //Regra de Produto Conceito
  await productConceptRules.execute();
  //Estoque pronta entrega
  await stocksPromptDelivery.execute();
  //Ordem de compra
  await purchasesOrder.execute();
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
