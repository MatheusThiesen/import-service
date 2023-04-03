import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { BrandsToSeller } from "../model/BrandsToSeller";
import {
  IBrandsToSellerRepository,
  QueryBrandsToSellerCountDTO,
  QueryBrandsToSellerFindAllDTO,
} from "./types/IBrandsToSellerRepository";

export class BrandsToSellerRepository implements IBrandsToSellerRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryBrandsToSellerCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_REP_MARCA rm         
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
  }: QueryBrandsToSellerFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const BrandsToSellers = await dbSiger.$ExecuteQuery<BrandsToSeller>(
      `
      select 
        ${filterFieldsNormalized(fields, "rm")}
      from 01010s005.DEV_REP_MARCA rm        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return BrandsToSellers;
  }
}
