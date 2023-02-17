import "dotenv/config";
import * as express from "express";
import {
  billetViewImportPortal,
  clientViewImportPortal,
  orderViewImportPortal,
  sellerViewImportPortal,
} from "./";

export class ServerPortal {
  async execute() {
    try {
      const app = express();
      app.use(express.json());

      app.post("/service/portal", async (req, res) => {
        const { entity, search } = req.body;

        const entitiesCorrect = ["pedido", "cliente", "boleto", "vendedor"];

        if (!entity || !search) {
          return res.status(400).send({ message: `Bad request` });
        }

        if (!entitiesCorrect.includes(entity)) {
          return res.status(400).send({ message: `Bad request` });
        }

        switch (entity) {
          case "pedido":
            await orderViewImportPortal.execute({
              search: search,
            });
            break;
          case "cliente":
            await clientViewImportPortal.execute({
              search: search,
            });
            break;
          case "boleto":
            await billetViewImportPortal.execute({
              search: search,
            });
            break;
          case "vendedor":
            await sellerViewImportPortal.execute({
              search: search,
            });
            break;
        }

        return res.send({});
      });

      app.listen(process.env.PORT, () => {
        console.log(`API Started at port ${process.env.PORT} 🔥`);
      });
    } catch (error) {
      console.log(`Error started API at port ${process.env.PORT}`);
    }
  }
}