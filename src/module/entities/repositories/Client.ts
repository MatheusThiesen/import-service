import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { Client } from "../model/Client";
import {
  IClientRepository,
  QueryClientCountDTO,
  QueryClientFindAllDTO,
} from "./types/IClientRepository";

export class ClientRepository implements IClientRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryClientCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_CLIENTE c
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
  }: QueryClientFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const Clients = await dbSiger.$ExecuteQuery<Client>(
      `
      select 
        ${filterFieldsNormalized(fields, "c")}
      from 01010s005.DEV_CLIENTE c        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return Clients;
  }
}
