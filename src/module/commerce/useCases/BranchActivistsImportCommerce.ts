import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface BranchActivistNormalized {
  codigo: number;
  descricao: string;
  abreviacao: string;
  situacao: number;
}

export class BranchActivistsImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    const branchActivists = await entities.registrationGroup.findAll({
      fields: {
        grupoCod: true,
        abreviacao: true,
        descricao: true,
        situacao: true,
      },
      search: search,
      pagesize: 99999,
    });

    const branchActivistsNormalized: BranchActivistNormalized[] =
      branchActivists.map((concept) => ({
        codigo: concept.grupoCod,
        descricao: concept.descricao,
        abreviacao: concept.abreviacao,
        situacao: concept.situacao,
      }));

    await this.sendData.post(
      "/branch-activists/import",
      branchActivistsNormalized
    );
  }
}
