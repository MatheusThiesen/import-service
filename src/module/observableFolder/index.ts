import * as cron from "node-cron";
import { productConceptRules } from "./useCases";

export async function executeEntities() {
  // //Produtos
  // await products.execute();
  // //Estoque pronta entrega
  // await stocksPromptDelivery.execute();
  // //Ordem de compra
  // await purchasesOrder.execute();
  // //Items pedidos
  // await ordersItems.execute();
  // //Conceito
  // await concepts.execute();
  // //Vendedores
  // await sellers.execute();
  // //Marca dos vendedores
  // await brandsToSeller.execute();

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
