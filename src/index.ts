import "dotenv/config";
import Queue from "./lib/Queue";

class App {
  async execute() {
    try {
      Queue.add("test");

      // console.log(
      //   await entities.brand.getAll({
      //     fields: {
      //       code: true,
      //       abbreviation: true,
      //     },
      //   })
      // );
    } catch (error) {
      console.log("error");
    }
  }
}

const app = new App();
app.execute();
