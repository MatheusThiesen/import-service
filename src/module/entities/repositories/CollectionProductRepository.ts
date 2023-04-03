import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { CollectionProduct } from "../model/CollectionProduct";
import {
  ICollectionProductRepository,
  QueryCollectionProductCountDTO,
  QueryCollectionProductFindAllDTO,
} from "./types/ICollectionProductRepository";

export class CollectionProductRepository
  implements ICollectionProductRepository
{
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryCollectionProductCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_COLECAO_PRODUTO c        
            ${this.whereNormalized(query.search)};
          `
        )
      )[0].total
    );

    return totalItems;
  }

  async findAll({
    fields,
    search,
    page = 0,
    pagesize = 200,
  }: QueryCollectionProductFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const CollectionProducts = await dbSiger.$ExecuteQuery<CollectionProduct>(
      `
      select 
        ${filterFieldsNormalized(fields, "c")}
      from 01010s005.DEV_COLECAO_PRODUTO c
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return CollectionProducts;
  }
}
