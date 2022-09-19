import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { SigerDTO } from "../../../service/siger";
import { Representative } from "../model/Representative";
import { apiSiger } from "./../../../service/apiSiger";
import {
  IRepresentativeRepository,
  QueryRepresentativeDTO,
} from "./types/IRepresentativeRepository";

export class RepresentativeRepository implements IRepresentativeRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryRepresentativeDTO): Promise<Representative[]> {
    const representatives = await apiSiger.get<SigerDTO<Representative>>(
      "/api/v1/get-list",
      {
        params: {
          entity: "representative",
          search: search,
          fields: filterFieldsNormalized(fields),
          extraFields: filterFieldsNormalized(extraFields),
        },
      }
    );

    return representatives.data.content;
  }
}
