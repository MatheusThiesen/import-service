import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface WalletSellerClientNormalized {
  clienteCod: number;
}

export class WalletSellerClientImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const sellers = await entities.seller.findAll({
        fields: {
          representanteCod: true,
        },
        search,
        pagesize: 99999,
      });

      console.log(search);

      for (const seller of sellers) {
        try {
          const walletsClientsSellers = await entities.linkClientSeller.findAll(
            {
              fields: {
                clienteCod: true,
              },
              search: `representanteCod in (${seller.representanteCod})`,
              pagesize: 99999,
            }
          );

          const walletsClientsSellersNormalized: WalletSellerClientNormalized[] =
            walletsClientsSellers.map((brand) => ({
              clienteCod: brand.clienteCod,
            }));

          await this.sendData.post(
            `/clients-to-sellers/import/${seller.representanteCod}`,
            walletsClientsSellersNormalized
          );
        } catch (error) {}
      }
    } catch (error) {
      console.log("[WALLET-SELLER-CLIENTS][ERRO]");
    }
  }
}
