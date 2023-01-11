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
  }: QueryRepresentativeDTO): Promise<Representative[]> {
    const representatives = await this.getListAll.execute<Representative>({
      entity: "representative",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
    });

    return representatives;
  }
}
