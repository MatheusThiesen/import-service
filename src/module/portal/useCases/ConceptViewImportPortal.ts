import { SendData } from "../repositories/SendData";
import { entities } from "./../../entities/useCases/index";

export class ConceptViewImportPortal {
  readonly pageSize = 10000;

  constructor(private sendData: SendData) {}

  async execute({ search }: { search?: string }) {
    try {
      const concepts = await entities.concept.findAll({
        fields: {
          conceitoCod: true,
          descricao: true,
          situacao: true,
        },
        search: search,
        pagesize: 99999,
      });

      await this.sendData.post("/concept/import", concepts);
    } catch (error) {
      console.log(error);
    }
  }
}
