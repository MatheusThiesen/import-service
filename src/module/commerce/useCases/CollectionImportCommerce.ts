import { ProductCollectionRepository } from "../../entities/repositories/ProductCollectionRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface CollectionNormalized {
  cod: number;
  name: string;
  status: number;
}

export class CollectionImportCommerce {
  constructor(
    private sendData: SendDataRepository,
    private productCollectionRepository: ProductCollectionRepository
  ) {}

  async execute({ search }: ExecuteServiceProps) {
    const collections = await this.productCollectionRepository.getAll({
      fields: {
        collectionCode: true,
        collectionDescription: true,
        situation: true,
      },
      search,
    });

    const collectionsNormalized: CollectionNormalized[] =
      collections.content.map((collection) => ({
        cod: collection.collectionCode,
        name: collection.collectionDescription,
        status: collection.situation,
      }));

    await this.sendData.post("/collections/import", collectionsNormalized);
  }
}
