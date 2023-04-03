import { groupByObject } from "../../../helpers/groupByObject";
import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export class BrandsToSellerImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    const brandsToSellers = await entities.brandsToSeller.findAll({
      fields: {
        marcaCod: true,
        representanteCod: true,
      },
      search,
      pagesize: 99999,
    });

    const groupSeller = groupByObject(
      brandsToSellers,
      (e) => e.representanteCod
    );
    const normalizedGroup = groupSeller.map((groupSeller) => ({
      codigo: groupSeller.value,
      marcasCod: groupSeller.data.map((brand) => brand.marcaCod).join(`,`),
    }));

    await this.sendData.post("/sellers/import", normalizedGroup);
  }
}
