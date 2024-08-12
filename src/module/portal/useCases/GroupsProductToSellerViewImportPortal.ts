import { entities } from "../../entities/useCases";
import { SendData } from "../repositories/SendData";

interface GroupsProductToSellerNormalized {
  representanteCod?: number;
  gerenteCod?: number;
  grupoCod?: number;
  dtInicio?: Date;
  dtFinal?: Date;
}

export class GroupsProductToSellerViewImportPortal {
  readonly pagesize = 2000;

  constructor(private sendData: SendData) {}

  async execute({ search }: { search?: string }) {
    try {
      const totalItems = await entities.groupsToSeller.count({ search });
      const totalPages = Math.ceil(totalItems / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const productGroups = await entities.groupsToSeller.findAll({
          fields: {
            representanteCod: true,
            gerenteCod: true,
            grupoCod: true,
            dtInicio: true,
            dtFinal: true,
          },
          search: search,
          page: page,
          pagesize: this.pagesize,
        });

        const normalized: GroupsProductToSellerNormalized[] = productGroups.map(
          (item) => ({
            representanteCod: item.representanteCod,
            gerenteCod: item.gerenteCod,
            grupoCod: item.grupoCod,
            dtInicio: item.dtInicio,
            dtFinal: item.dtFinal,
          })
        );

        await this.sendData.post("/seller/groups-product/import", normalized);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
