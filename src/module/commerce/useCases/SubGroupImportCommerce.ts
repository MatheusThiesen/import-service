import { ProductSubgroupRepository } from "../../entities/repositories/ProductSubgroupRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface ProductSubGroupsNormalized {
  cod: number;
  name: string;
  status: number;
  codGroup: number;
}

export class SubGroupImportCommerce {
  constructor(
    private sendData: SendDataRepository,
    private productSubgroupRepository: ProductSubgroupRepository
  ) {}

  async execute({ search }: ExecuteServiceProps) {
    const productGroups = await this.productSubgroupRepository.getAll({
      fields: {
        code: true,
        description: true,
        // situation: true, -> Erro no campo,
        group: {
          code: true,
        },
      },
      search: search,
    });

    const productSubgroupsNormalized: ProductSubGroupsNormalized[] =
      productGroups.map((group) => ({
        cod: group.code,
        name: group.description,
        status: 1,
        codGroup: group?.group?.code,
      }));

    await this.sendData.post("/subgroups/import", productSubgroupsNormalized);
  }
}
