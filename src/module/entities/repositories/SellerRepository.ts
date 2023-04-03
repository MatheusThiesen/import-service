import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { Seller } from "../model/Seller";
import {
  ISellerRepository,
  QuerySellerCountDTO,
  QuerySellerFindAllDTO,
} from "./types/ISellerRepository";

export class SellerRepository implements ISellerRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QuerySellerCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_REPRESENTANTE r         
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
  }: QuerySellerFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const Sellers = await dbSiger.$ExecuteQuery<Seller>(
      `
      select 
        ${filterFieldsNormalized(fields, "r")}
      from 01010s005.DEV_REPRESENTANTE r        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return Sellers;
  }
}
