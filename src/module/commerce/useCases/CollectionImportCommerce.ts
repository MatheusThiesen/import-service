import { entities } from "../../../module/entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface CollectionNormalized {
  cod: number;
  name: string;
  status: number;
}

export class CollectionImportCommerce {
  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const collections = await entities.collectionProduct.findAll({
        fields: {
          colecaoCod: true,
          descricao: true,
          situacao: true,
        },
        search,
        pagesize: 99999,
      });

      const collectionsNormalized: CollectionNormalized[] = collections.map(
        (collection) => ({
          cod: collection.colecaoCod,
          name: collection.descricao,
          status: collection.situacao,
        })
      );

      await this.sendData.post("/collections/import", collectionsNormalized);
    } catch (error) {
      console.log("[COLLECTIONS][ERRO]");
    }
  }
}
