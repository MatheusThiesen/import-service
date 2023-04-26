import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { LinkClientSeller } from "../model/LinkClientSeller";
import {
  ILinkClientSellerRepository,
  QueryLinkClientSellerCountDTO,
  QueryLinkClientSellerFindAllDTO,
} from "./types/ILinkClientSellerRepository";

export class LinkClientSellerRepository implements ILinkClientSellerRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryLinkClientSellerCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.DEV_CLIENTE_REPRESENTANTE cr
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
  }: QueryLinkClientSellerFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const LinkClientSellers = await dbSiger.$ExecuteQuery<LinkClientSeller>(
      `
      select 
        ${filterFieldsNormalized(fields, "cr")}
      from 01010s005.DEV_CLIENTE_REPRESENTANTE cr        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return LinkClientSellers;
  }
}
