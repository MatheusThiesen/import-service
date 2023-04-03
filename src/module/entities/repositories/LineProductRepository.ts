import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { LineProduct } from "../model/LineProduct";
import {
  ILineProductRepository,
  QueryLineProductCountDTO,
  QueryLineProductFindAllDTO,
} from "./types/ILineProductRepository";

export class LineProductRepository implements ILineProductRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryLineProductCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_LINHA_PRODUTO l         
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
  }: QueryLineProductFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const LineProducts = await dbSiger.$ExecuteQuery<LineProduct>(
      `
      select 
        ${filterFieldsNormalized(fields, "l")}
      from 01010s005.DEV_LINHA_PRODUTO l        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return LineProducts;
  }
}
