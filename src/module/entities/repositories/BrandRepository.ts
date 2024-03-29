import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { Brand } from "../model/Brand";
import {
  IBrandRepository,
  QueryBrandCountDTO,
  QueryBrandFindAllDTO,
} from "./types/IBrandRepository";

export class BrandRepository implements IBrandRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryBrandCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_MARCA m         
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
  }: QueryBrandFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const brands = await dbSiger.$ExecuteQuery<Brand>(
      `
      select 
        ${filterFieldsNormalized(fields, "m")}
      from 01010s005.DEV_MARCA m        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return brands;
  }
}
