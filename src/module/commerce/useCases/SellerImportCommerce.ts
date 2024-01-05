import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";
import { entities } from "./../../entities/useCases/index";

export class SellerImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const sellers = await entities.seller.findAll({
        fields: {
          representanteCod: true,
          abreviacao: true,
          descricao: true,
          email: true,
          fone: true,
          situacao: true,
          eGerente: true,
          eSupervisor: true,
          gerenteCod: true,
          supervisorCod: true,
        },
        search,
        pagesize: 99999,
      });

      const sellersNormalized = sellers.map((seller) => ({
        codigo: seller.representanteCod,
        marcasCod: ``,
        codGerente: seller.gerenteCod ?? "",
        codSupervisor: seller.supervisorCod ?? "",
        nome: seller.descricao ?? "",
        nomeGuerra: seller.abreviacao ?? "",
        email: seller.email ?? "",
        situation: seller.situacao ?? "",
        eGerente: seller.eGerente === 1 ? `s` : `n`,
        eSupervisor: seller.eSupervisor === 1 ? `s` : `n`,
      }));

      await this.sendData.post("/sellers/import", sellersNormalized);
    } catch (error) {
      console.log("[SELLERS][ERRO]");
    }
  }
}
