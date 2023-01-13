import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { Representative } from "../model/Representative";
import { GetListAll } from "../useCases/GetListAll";
import {
  IRepresentativeRepository,
  QueryRepresentativeDTO,
} from "./types/IRepresentativeRepository";

export class RepresentativeRepository implements IRepresentativeRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
    page,
    size,
    isPagination,
  }: QueryRepresentativeDTO) {
    const representatives = await this.getListAll.execute<Representative>({
      entity: "representative",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
      page,
      size,
      isPagination,
    });

    return representatives;
  }
}
