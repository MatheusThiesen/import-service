import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { Billet } from "../model/Billet";
import {
  IBilletRepository,
  QueryBilletCountDTO,
  QueryBilletFindAllDTO,
} from "./types/IBilletRepository";

export class BilletRepository implements IBilletRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryBilletCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.dev_titulo t         
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
  }: QueryBilletFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const Billets = await dbSiger.$ExecuteQuery<Billet>(
      `
      select 
        ${filterFieldsNormalized(fields, "t")}
      from 01010s005.dev_titulo t        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return Billets;
  }
}
