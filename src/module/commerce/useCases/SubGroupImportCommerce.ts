import { entities } from "../../../module/entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface ProductSubGroupsNormalized {
  cod: number;
  name: string;
  status: number;
  codGroup: number;
}

export class SubGroupImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    const productGroups = await entities.subgroupProduct.findAll({
      fields: {
        subgrupoCod: true,
        descricao: true,
        situacao: true,
        grupoCod: true,
      },
      search: search,
      pagesize: 99999,
    });

    const productSubgroupsNormalized: ProductSubGroupsNormalized[] =
      productGroups.map((group) => ({
        cod: group.subgrupoCod,
        name: group.descricao,
        status: group.situacao,
        codGroup: group.grupoCod,
      }));

    await this.sendData.post("/subgroups/import", productSubgroupsNormalized);
  }
}
