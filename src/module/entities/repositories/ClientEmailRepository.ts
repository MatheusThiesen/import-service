import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { ClientEmail } from "../model/ClientEmail";
import {
  IClientEmailRepository,
  QueryClientEmailCountDTO,
  QueryClientEmailFindAllDTO,
  QueryClientEmailFindOneDTO,
} from "./types/IClientEmailRepository";

export class ClientEmailRepository implements IClientEmailRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryClientEmailCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_CLIENTE_EMAIL e         
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
  }: QueryClientEmailFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const ClientEmails = await dbSiger.$ExecuteQuery<ClientEmail>(
      `
      select 
        ${filterFieldsNormalized(fields, "e")}
      from 01010s005.DEV_CLIENTE_EMAIL e        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return ClientEmails;
  }

  async findOne({
    fields,
    search,
  }: QueryClientEmailFindOneDTO): Promise<ClientEmail> {
    const limit = 1;

    const clientsObs = await dbSiger.$ExecuteQuery<ClientEmail>(
      `
      select 
        ${filterFieldsNormalized(fields, "e")}
      from 01010s005.DEV_CLIENTE_EMAIL e        
      ${this.whereNormalized(search)}
      limit ${limit};
      `
    );

    return clientsObs && clientsObs[0] ? clientsObs[0] : null;
  }
}
