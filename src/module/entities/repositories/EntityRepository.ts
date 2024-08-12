import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
  QueryFindFirstEntitySiger,
} from "src/service/siger";
import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { ITypeRepository } from "./types/ITypeRepository";

export class EntityRepository<T, D> implements ITypeRepository<T, D> {
  private table: string;
  private initial: string;

  constructor({ table, initial }: { table: string; initial: string }) {
    this.table = table;
    this.initial = initial;
  }

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async findAll({
    fields,
    search,
    page = 0,
    pagesize = 200,
  }: QueryFindAllEntitySiger<T>): Promise<D[]> {
    const limit = pagesize;
    const offset = pagesize * page;

    const data = await dbSiger.$ExecuteQuery<D>(
      `
      select 
        ${filterFieldsNormalized(fields, this.initial)}
      from ${this.table} ${this.initial}
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return data;
  }

  async count(query: QueryCountEntitySiger): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM ${this.table} ${
            this.initial
          }                 
            ${this.whereNormalized(query.search)};
          `
        )
      )[0].total
    );

    return totalItems;
  }

  async findFirst(query: QueryFindFirstEntitySiger<T>): Promise<D> {
    const limit = 1;

    const datas = await dbSiger.$ExecuteQuery<D>(
      `
      select 
        ${filterFieldsNormalized(query.fields, this.initial)}
      from ${this.table} ${this.initial}        
      ${this.whereNormalized(query.search)}
      limit ${limit};
      `
    );

    return datas && datas[0] ? datas[0] : null;
  }
}
