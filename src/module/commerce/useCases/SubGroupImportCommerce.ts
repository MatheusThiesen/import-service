import { ProductSubgroupRepository } from "../../entities/repositories/ProductSubgroupRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";

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

  async execute() {
    const productGroups = await this.productSubgroupRepository.getAll({
      fields: {
        code: true,
        description: true,
        // situation: true, -> Erro no campo,
        group: {
          code: true,
        },
      },
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
