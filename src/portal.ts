import { orderViewImportPortal } from "./module/portal/useCases";

export class Portal {
  async execute() {
    try {
      await orderViewImportPortal.execute({
        // search: "p.codigo = 1249226",
        search: "p.dtEntrada > '2022-02-10' ",
      });
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}
