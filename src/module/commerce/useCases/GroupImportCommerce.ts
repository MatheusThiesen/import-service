import { entities } from "../../../module/entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface ProductGroupsNormalized {
  cod: number;
  name: string;
  status: number;
}

export class GroupImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    const productGroups = await entities.groupProduct.findAll({
      fields: {
        grupoCod: true,
        descricao: true,
        situacao: true,
      },
      search: search,
      pagesize: 99999,
    });

    const productGroupsNormalized: ProductGroupsNormalized[] =
      productGroups.map((group) => ({
        cod: group.grupoCod,
        name: group.descricao,
        status: group.situacao,
      }));

    await this.sendData.post("/groups/import", productGroupsNormalized);
  }
}
