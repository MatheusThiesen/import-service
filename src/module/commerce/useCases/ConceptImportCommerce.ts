import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface ConceptNormalized {
  codigo: number;
  descricao: string;
  abreviacao: string;
  situacao: number;
}

export class ConceptImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const concepts = await entities.concept.findAll({
        fields: {
          conceitoCod: true,
          abreviacao: true,
          descricao: true,
          situacao: true,
        },
        search: search,
        pagesize: 99999,
      });

      const conceptsNormalized: ConceptNormalized[] = concepts.map(
        (concept) => ({
          codigo: concept.conceitoCod,
          descricao: concept.descricao,
          abreviacao: concept.abreviacao,
          situacao: concept.situacao,
        })
      );

      await this.sendData.post("/concepts/import", conceptsNormalized);
    } catch (error) {
      console.log("[CONCEPTS][ERRO]");
    }
  }
}
