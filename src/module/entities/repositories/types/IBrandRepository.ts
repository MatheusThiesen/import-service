import { QueryEntitySiger } from "../../../../service/siger";
import { Brand, BrandExtraFields, BrandFields } from "../../model/Brand";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryBrandDTO = QueryEntitySiger<BrandFields, BrandExtraFields>;

export interface IBrandRepository {
  getAll(query: QueryBrandDTO): Promise<GetListAllResponse<Brand>>;
}
