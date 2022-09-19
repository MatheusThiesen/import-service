import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { Brand } from "../model/Brand";
import { IBrandRepository, QueryBrandDTO } from "./types/IBrandRepository";

export class BrandRepository implements IBrandRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryBrandDTO): Promise<Brand[]> {
    const brands = await apiSiger.get<SigerDTO<Brand>>("/api/v1/get-list", {
      params: {
        entity: "brand",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
      },
    });

    return brands.data.content;
  }
}
