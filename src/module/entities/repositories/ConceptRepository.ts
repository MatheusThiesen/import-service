import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { Concept } from "../model/Concept";
import {
  IConceptRepository,
  QueryConceptCountDTO,
  QueryConceptFindAllDTO,
} from "./types/IConceptRepository";

export class ConceptRepository implements IConceptRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryConceptCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_CONCEITO c
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
  }: QueryConceptFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const Concepts = await dbSiger.$ExecuteQuery<Concept>(
      `
      select 
        ${filterFieldsNormalized(fields, "c")}
      from 01010s005.DEV_CONCEITO c        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return Concepts;
  }
}
