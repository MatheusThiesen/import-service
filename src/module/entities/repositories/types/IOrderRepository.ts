import { QueryEntitySiger } from "../../../../service/siger";
import { Order, OrderExtraFields, OrderFields } from "../../model/Order";

export type QueryOrderDTO = QueryEntitySiger<OrderFields, OrderExtraFields>;

export interface IOrderRepository {
  getAll(query: QueryOrderDTO): Promise<Order[]>;
}
