import "dotenv/config";
import { observableFolder } from "./module/observableFolder";
// import { productImportCommerce } from "./module/commerce/useCases/";

class App {
  async execute() {
    try {
      // await colorImportCommerce.execute();
      // console.log("colorImportCommerce");

      // await groupImportCommerce.execute();
      // console.log("groupImportCommerce");

      // await subgroupImportCommerce.execute();
      // console.log("subgroupImportCommerce");

      // await lineImportCommerce.execute();
      // console.log("lineImportCommerce");

      // await brandImportCommerce.execute();
      // console.log("brandImportCommerce");

      // await collectionImportCommerce.execute();
      // console.log("collectionImportCommerce");

      // await productImportCommerce.execute();
      // console.log("productImportCommerce");

      // await stockLocationImportCommerce.execute();
      // console.log("stockLocationImportCommerce");

      await observableFolder();
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}

const app = new App();
app.execute();
