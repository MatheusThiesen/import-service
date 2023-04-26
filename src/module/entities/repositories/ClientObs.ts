import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { ClientObs } from "../model/ClientObs";
import {
  IClientObsRepository,
  QueryClientObsCountDTO,
  QueryClientObsFindAllDTO,
  QueryClientObsFindOneDTO,
} from "./types/IClientObsRepository";

export class ClientObsRepository implements IClientObsRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryClientObsCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_CLIENTE_OBSERVACOES o
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
  }: QueryClientObsFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const ClientObss = await dbSiger.$ExecuteQuery<ClientObs>(
      `
      select 
        ${filterFieldsNormalized(fields, "o")}
      from 01010s005.DEV_CLIENTE_OBSERVACOES o        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return ClientObss;
  }

  async findOne({
    fields,
    search,
  }: QueryClientObsFindOneDTO): Promise<ClientObs> {
    const limit = 1;

    const clientsObs = await dbSiger.$ExecuteQuery<ClientObs>(
      `
      select 
        ${filterFieldsNormalized(fields, "o")}
      from 01010s005.DEV_CLIENTE_OBSERVACOES o        
      ${this.whereNormalized(search)}
      limit ${limit};
      `
    );

    return clientsObs && clientsObs[0] ? clientsObs[0] : null;
  }
}
