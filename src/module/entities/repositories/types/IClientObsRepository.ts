import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
  QueryFindFirstEntitySiger,
} from "../../../../service/siger";
import { ClientObs, ClientObsFields } from "../../model/ClientObs";

export type QueryClientObsFindAllDTO = QueryFindAllEntitySiger<ClientObsFields>;
export type QueryClientObsCountDTO = QueryCountEntitySiger;
export type QueryClientObsFindOneDTO =
  QueryFindFirstEntitySiger<ClientObsFields>;

export interface IClientObsRepository {
  findAll(query: QueryClientObsFindAllDTO): Promise<ClientObs[]>;
  findOne(query: QueryClientObsFindOneDTO): Promise<ClientObs>;
  count(query: QueryClientObsCountDTO): Promise<number>;
}
