import { entities } from "../../entities/useCases/index";
import { SendData } from "../repositories/SendData";

export class WalletSellerClientsViewImportPortal {
  readonly pagesize = 1600;

  constructor(private sendData: SendData) {}

  async execute({ search }: { search?: string }) {
    const query = search ? `tipo = 2 and ${search}` : `tipo = 2`;

    try {
      const totalClient = await entities.linkClientSeller.count({
        search: query,
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
          search: query,
          page: page,
          pagesize: this.pagesize,
        });

        const walletsClientsSellersNormalized = walletsClientsSellers.map(
          (item) => ({
            clienteCod: item.clienteCod,
            representanteCod: item.representanteCod,
            tipo: item.tipo,
          })
        );

        await this.sendData.post(
          "/wallet-clients-to-seller/import",
          walletsClientsSellersNormalized
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
