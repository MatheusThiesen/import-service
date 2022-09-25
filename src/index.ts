import "dotenv/config";
import Queue from "./lib/Queue";

class App {
  async execute() {
    try {
      Queue.add(
        "executeService",
        {
          service: "OrderImportPortal",
        }
        // { repeat: { cron: "* * * * *" } }
      );
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}

const app = new App();
app.execute();
