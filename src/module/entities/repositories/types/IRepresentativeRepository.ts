import { QueryEntitySiger } from "../../../../service/siger.d";
import {
  Representative,
  RepresentativeExtraFields,
  RepresentativeFields,
} from "../../model/Representative";

export type QueryRepresentativeDTO = QueryEntitySiger<
  RepresentativeFields,
  RepresentativeExtraFields
>;

export interface IRepresentativeRepository {
  getAll(query: QueryRepresentativeDTO): Promise<Representative[]>;
}
