import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { Client, ClientFields } from "../../model/Client";

export type QueryClientFindAllDTO = QueryFindAllEntitySiger<ClientFields>;
export type QueryClientCountDTO = QueryCountEntitySiger;

export interface IClientRepository {
  findAll(query: QueryClientFindAllDTO): Promise<Client[]>;
  count(query: QueryClientCountDTO): Promise<number>;
}
