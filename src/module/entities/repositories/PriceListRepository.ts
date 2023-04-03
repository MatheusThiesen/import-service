import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { PriceList } from "../model/PriceList";
import {
  IPriceListRepository,
  QueryPriceListCountDTO,
  QueryPriceListFindAllDTO,
} from "./types/IPriceListRepository";

export class PriceListRepository implements IPriceListRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryPriceListCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_LISTA_PRECO l         
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
  }: QueryPriceListFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const PriceLists = await dbSiger.$ExecuteQuery<PriceList>(
      `
      select 
        ${filterFieldsNormalized(fields, "l")}
      from 01010s005.DEV_LISTA_PRECO l        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return PriceLists;
  }
}
