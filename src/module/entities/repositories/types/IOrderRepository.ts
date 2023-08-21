import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { Order, OrderFields } from "../../model/Order";

export type QueryOrderFindAllDTO = QueryFindAllEntitySiger<OrderFields>;
export type QueryOrderCountDTO = QueryCountEntitySiger;

export interface IOrderRepository {
  findAll(query: QueryOrderFindAllDTO): Promise<Order[]>;
  count(query: QueryOrderCountDTO): Promise<number>;
}
