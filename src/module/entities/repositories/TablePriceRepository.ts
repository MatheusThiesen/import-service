import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { TablePrice } from "../model/TablePrice";
import {
  ITablePriceRepository,
  QueryTablePriceCountDTO,
  QueryTablePriceFindAllDTO,
} from "./types/ITablePriceRepository";

export class TablePriceRepository implements ITablePriceRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryTablePriceCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_TABELA_PRECO p         
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
  }: QueryTablePriceFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const TablePrices = await dbSiger.$ExecuteQuery<TablePrice>(
      `
      select 
        ${filterFieldsNormalized(fields, "p")}
      from 01010s005.DEV_TABELA_PRECO p        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return TablePrices;
  }
}
