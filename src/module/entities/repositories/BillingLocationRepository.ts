import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { BillingLocation } from "../model/BillingLocation";
import {
  IBillingLocationRepository,
  QueryBillingLocationCountDTO,
  QueryBillingLocationFindAllDTO,
} from "./types/IBillingLocationRepository";

export class BillingLocationRepository implements IBillingLocationRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryBillingLocationCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.dev_local_cobranca l         
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
  }: QueryBillingLocationFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const BillingLocations = await dbSiger.$ExecuteQuery<BillingLocation>(
      `
      select 
        ${filterFieldsNormalized(fields, "l")}
      from 01010s005.dev_local_cobranca l        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return BillingLocations;
  }
}
