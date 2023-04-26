import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { RegistrationGroup } from "../model/RegistrationGroup";
import {
  IRegistrationGroupRepository,
  QueryRegistrationGroupCountDTO,
  QueryRegistrationGroupFindAllDTO,
} from "./types/IRegistrationGroupRepository";

export class RegistrationGroupRepository
  implements IRegistrationGroupRepository
{
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryRegistrationGroupCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_GRUPO_CADASTRO g
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
  }: QueryRegistrationGroupFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const RegistrationGroups = await dbSiger.$ExecuteQuery<RegistrationGroup>(
      `
      select 
        ${filterFieldsNormalized(fields, "g")}
      from 01010s005.DEV_GRUPO_CADASTRO g        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return RegistrationGroups;
  }
}
