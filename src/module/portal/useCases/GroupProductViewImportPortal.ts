import { entities } from "../../../module/entities/useCases";
import { SendData } from "../repositories/SendData";

interface ProductGroupsNormalized {
  cod: number;
  name: string;
  status: number;
}

export class GroupProductViewImportPortal {
  constructor(private sendData: SendData) {}

  async execute({ search }: { search?: string }) {
    try {
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

      await this.sendData.post(
        "/groups-product/import",
        productGroupsNormalized
      );
    } catch (error) {
      console.log(error);
    }
  }
}
