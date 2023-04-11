import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { EanProduct } from "../model/EanProduct";
import {
  IEanProductRepository,
  QueryEanProductCountDTO,
  QueryEanProductFindAllDTO,
  QueryEanProductFindFirstDTO,
} from "./types/IEanProductRepository";

export class EanProductRepository implements IEanProductRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryEanProductCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_EAN_GRADE e         
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
  }: QueryEanProductFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const EanProducts = await dbSiger.$ExecuteQuery<EanProduct>(
      `
      select 
        ${filterFieldsNormalized(fields, "e")}
      from 01010s005.DEV_EAN_GRADE e        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return EanProducts;
  }

  async findFirst({ fields, search }: QueryEanProductFindFirstDTO) {
    const limit = 1;

    const EanProducts = await dbSiger.$ExecuteQuery<EanProduct>(
      `
      select 
        ${filterFieldsNormalized(fields, "e")}
      from 01010s005.DEV_EAN_GRADE e        
      ${this.whereNormalized(search)}
      limit ${limit};
      `
    );

    return EanProducts && EanProducts[0] ? EanProducts[0] : null;
  }
}
