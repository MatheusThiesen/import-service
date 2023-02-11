import { orderViewImportPortal } from "./module/portal/useCases";

export class Portal {
  async execute() {
    try {
      await orderViewImportPortal.execute({
        search: "p.codigo = 1123467",
      });
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}
