import * as cron from "node-cron";
import { products } from "./useCases";

export async function observableFolder() {
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

      //Produtos
      await products.execute("products");
    } catch (error) {
      console.log("[INDEX] error");
    }
  });
}
