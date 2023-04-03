import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { GroupProduct } from "../model/GroupProduct";
import {
  IGroupProductRepository,
  QueryGroupProductCountDTO,
  QueryGroupProductFindAllDTO,
} from "./types/IGroupProductRepository";

export class GroupProductRepository implements IGroupProductRepository {
  constructor() {}

  private whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryGroupProductCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_GRUPO_PRODUTO g         
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
  }: QueryGroupProductFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const GroupProducts = await dbSiger.$ExecuteQuery<GroupProduct>(
      `
      select 
        ${filterFieldsNormalized(fields, "g")}
      from 01010s005.DEV_GRUPO_PRODUTO g        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return GroupProducts;
  }
}
