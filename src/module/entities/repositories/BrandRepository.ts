import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { Brand } from "../model/Brand";
import { GetListAll } from "../useCases/GetListAll";
import { IBrandRepository, QueryBrandDTO } from "./types/IBrandRepository";

export class BrandRepository implements IBrandRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
    page,
    size,
    isPagination,
  }: QueryBrandDTO) {
    const brands = await this.getListAll.execute<Brand>({
      entity: "brand",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
      page,
      size,
      isPagination,
    });

    return brands;
  }
}
