import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export class BlockGroupProductToSellerImportCommerce {
  readonly pagesize = 800;

  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const DEFAULT_QUERY = `r.situacao = 1 and r.representanteCod not in (2390,2945,3048,3049)`;
      const query = search ? `${DEFAULT_QUERY} and ${search}` : DEFAULT_QUERY;

      const sellers = await entities.seller.findAll({
        fields: {
          representanteCod: true,
          gerenteCod: true,
        },
        search: query,
        pagesize: 99999,
      });

      const groups = (
        await entities.groupProduct.findAll({
          fields: {
            grupoCod: true,
          },
          pagesize: 99999,
        })
      ).map((group) => group.grupoCod);

      for (const seller of sellers) {
        try {
          const productGroups = (
            await entities.groupsToSeller.findAll({
              fields: {
                grupoCod: true,
              },
              search: `rg.representanteCod = ${seller.representanteCod} and gerenteCod = ${seller.gerenteCod}`,
              pagesize: 9999,
            })
          ).map((group) => group.grupoCod);

          const productGroupsNormalized = groups.filter(
            (f) => !productGroups.includes(f)
          );

          await this.sendData.POST(
            `panel/sellers/blocks/${seller.representanteCod}`,
            { groups: productGroupsNormalized }
          );
        } catch (error) {}
      }
    } catch (error) {
      console.log("[BLOCK-GROUP-PRODUCT-TO-SELLER][ERRO]");
    }
  }
}
