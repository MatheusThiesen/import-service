import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface WalletSellerClientNormalized {
  clienteCod: number;
  sellerCod: number;
  tipo: number;
}

export class WalletSellerClientImportCommerce {
  readonly pagesize = 1600;

  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
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

      const walletsClientsSellersNormalized: WalletSellerClientNormalized[] =
        walletsClientsSellers.map((brand) => ({
          clienteCod: brand.clienteCod,
          sellerCod: brand.representanteCod,
          tipo: brand.tipo,
        }));

      await this.sendData.post(
        "/clients-to-sellers/import",
        walletsClientsSellersNormalized
      );
    }
  }
}
