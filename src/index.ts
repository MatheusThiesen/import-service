import "dotenv/config";
// import axios from "axios";

// stockLocationImportCommerce ,
// brandImportCommerce,
//   collectionImportCommerce,
//   groupImportCommerce,
//   lineImportCommerce,
//   productImportCommerce,
//   subgroupImportCommerce,

import {
  productImportCommerce,
  stockLocationImportCommerce,
} from "./module/commerce/useCases/";

// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
// });
// axios.defaults.httpAgent = httpsAgent;

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

      await productImportCommerce.execute();
      console.log("productImportCommerce");

      await stockLocationImportCommerce.execute();
      console.log("stockLocationImportCommerce");

      console.log(
        "terminou" +
          new Date().toLocaleDateString("pt-br", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
      );
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}

const app = new App();
app.execute();
