import { ProductGroupRepository } from "../../../module/entities/repositories/ProductGroupRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface ProductGroupsNormalized {
  cod: number;
  name: string;
  status: number;
}

export class GroupImportCommerce {
  constructor(
    private sendData: SendDataRepository,
    private productGroupRepository: ProductGroupRepository
  ) {}

  async execute({ search }: ExecuteServiceProps) {
    const productGroups = await this.productGroupRepository.getAll({
      fields: {
        code: true,
        description: true,
        // situation: true, -> Erro no campo
      },
      search: search,
    });

    const productGroupsNormalized: ProductGroupsNormalized[] =
      productGroups.content.map((group) => ({
        cod: group.code,
        name: group.description,
        status: 1,
      }));

    await this.sendData.post("/groups/import", productGroupsNormalized);
  }
}
