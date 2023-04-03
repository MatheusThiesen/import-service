import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { SubgroupProduct } from "../model/SubgroupProduct";
import {
  ISubgroupProductRepository,
  QuerySubgroupProductCountDTO,
  QuerySubgroupProductFindAllDTO,
} from "./types/ISubgroupProductRepository";

export class SubgroupProductRepository implements ISubgroupProductRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QuerySubgroupProductCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_SUBGRUPO_PRODUTO s         
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
  }: QuerySubgroupProductFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const SubgroupProducts = await dbSiger.$ExecuteQuery<SubgroupProduct>(
      `
      select 
        ${filterFieldsNormalized(fields, "s")}
      from 01010s005.DEV_SUBGRUPO_PRODUTO s        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return SubgroupProducts;
  }
}
