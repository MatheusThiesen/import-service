import { QueryEntitySiger } from "../../../../service/siger";
import { Brand, BrandExtraFields, BrandFields } from "../../model/Brand";

export type QueryBrandDTO = QueryEntitySiger<BrandFields, BrandExtraFields>;

export interface IBrandRepository {
  getAll(query: QueryBrandDTO): Promise<Brand[]>;
}
