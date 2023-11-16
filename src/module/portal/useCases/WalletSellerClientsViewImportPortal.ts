import { entities } from "../../entities/useCases/index";
import { SendData } from "../repositories/SendData";

export class ConceptViewImportPortal {
  readonly pagesize = 1600;

  constructor(private sendData: SendData) {}

  async execute({ search }: { search?: string }) {
    try {
      const totalClient = await entities.linkClientSeller.count({
        search: search,
      });
      const totalPages = Math.ceil(totalClient / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const walletsClientsSellers = await entities.linkClientSeller.findAll({
          fields: {
            representanteCod: true,
            clienteCod: true,
            tipo: true,
          },
          search,
          page: page,
          pagesize: this.pagesize,
        });

        const walletsClientsSellersNormalized = walletsClientsSellers.map(
          (item) => ({
            clienteCod: item.clienteCod,
            sellerCod: item.representanteCod,
            tipo: item.tipo,
          })
        );

        await this.sendData.post(
          "/clients-to-sellers/import",
          walletsClientsSellersNormalized
        );
        await this.sendData.post(
          "/clients-to-sellers/import",
          walletsClientsSellersNormalized
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
