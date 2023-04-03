import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { Brand, BrandFields } from "../../model/Brand";

export type QueryBrandFindAllDTO = QueryFindAllEntitySiger<BrandFields>;
export type QueryBrandCountDTO = QueryCountEntitySiger;

export interface IBrandRepository {
  findAll(query: QueryBrandFindAllDTO): Promise<Brand[]>;
  count(query: QueryBrandCountDTO): Promise<number>;
}
