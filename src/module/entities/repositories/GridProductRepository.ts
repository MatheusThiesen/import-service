import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { GridProduct } from "../model/GridProduct";
import {
  IGridProductRepository,
  QueryGridProductCountDTO,
  QueryGridProductFindAllDTO,
} from "./types/IGridProductRepository";

export class GridProductRepository implements IGridProductRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryGridProductCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_GRADE_PRODUTO g         
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
    pagesize = 9999,
  }: QueryGridProductFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const GridProducts = await dbSiger.$ExecuteQuery<GridProduct>(
      `
      select 
        ${filterFieldsNormalized(fields, "g")}
      from 01010s005.DEV_GRADE_PRODUTO g        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return GridProducts;
  }
}
