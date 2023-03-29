import * as cors from "cors";
import "dotenv/config";
import * as express from "express";
import { queue } from "../../../queue";

export class ServerPortal {
  async execute() {
    try {
      const app = express();
      app.use(cors());
      app.use(express.json());

      app.post("/service/portal", async (req, res) => {
        const { entity, search } = req.body;

        const entitiesCorrect = [
          "pedido",
          "cliente",
          "boleto",
          "vendedor",
          "grade",
          "ean",
          "marcasRep",
        ];

        if (!entity) {
          return res.status(400).send({ message: `Bad request` });
        }

        if (!entitiesCorrect.includes(entity)) {
          return res.status(400).send({ message: `Bad request` });
        }

        switch (entity) {
          case "pedido":
            queue.push({
              search: search ?? undefined,
              entity: "orderViewImportPortal",
            });

            break;
          case "cliente":
            queue.push({
              search: search ?? undefined,
              entity: "clientViewImportPortal",
            });
            break;
          case "boleto":
            queue.push({
              search: search ?? undefined,
              entity: "billetViewImportPortal",
            });
            break;
          case "vendedor":
            queue.push({
              search: search ?? undefined,
              entity: "sellerViewImportPortal",
            });
            break;
          case "grade":
            queue.push({
              search: search ?? undefined,
              entity: "gridViewImportPortal",
            });
            break;
          case "ean":
            queue.push({
              search: search ?? undefined,
              entity: "eanViewImportPortal",
            });
            break;
          case "marcasRep":
            queue.push({
              search: search ?? undefined,
              entity: "brandsToSellerViewImportPortal",
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
