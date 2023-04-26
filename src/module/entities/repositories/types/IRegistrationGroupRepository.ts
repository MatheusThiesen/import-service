import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import {
  RegistrationGroup,
  RegistrationGroupFields,
} from "../../model/RegistrationGroup";

export type QueryRegistrationGroupFindAllDTO =
  QueryFindAllEntitySiger<RegistrationGroupFields>;
export type QueryRegistrationGroupCountDTO = QueryCountEntitySiger;

export interface IRegistrationGroupRepository {
  findAll(
    query: QueryRegistrationGroupFindAllDTO
  ): Promise<RegistrationGroup[]>;
  count(query: QueryRegistrationGroupCountDTO): Promise<number>;
}
