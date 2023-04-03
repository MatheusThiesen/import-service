import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { Color } from "../model/Color";
import {
  IColorRepository,
  QueryColorCountDTO,
  QueryColorFindAllDTO,
} from "./types/IColorRepository";

export class ColorRepository implements IColorRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryColorCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_COR_PRODUTO c         
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
  }: QueryColorFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const Colors = await dbSiger.$ExecuteQuery<Color>(
      `
      select 
        ${filterFieldsNormalized(fields, "c")}
      from 01010s005.DEV_COR_PRODUTO c        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return Colors;
  }
}
