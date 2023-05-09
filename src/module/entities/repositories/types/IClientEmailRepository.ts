import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
  QueryFindFirstEntitySiger,
} from "../../../../service/siger";
import { ClientEmail, ClientEmailFields } from "../../model/ClientEmail";

export type QueryClientEmailFindAllDTO =
  QueryFindAllEntitySiger<ClientEmailFields>;
export type QueryClientEmailCountDTO = QueryCountEntitySiger;
export type QueryClientEmailFindOneDTO =
  QueryFindFirstEntitySiger<ClientEmailFields>;

export interface IClientEmailRepository {
  findAll(query: QueryClientEmailFindAllDTO): Promise<ClientEmail[]>;
  count(query: QueryClientEmailCountDTO): Promise<number>;
  findOne(query: QueryClientEmailFindOneDTO): Promise<ClientEmail>;
}
