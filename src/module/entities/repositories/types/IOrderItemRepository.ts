import { QueryEntitySiger } from "../../../../service/siger";
import {
  OrderItem,
  OrderItemExtraFields,
  OrderItemFields,
} from "../../model/OrderItem";

export type QueryOrderItemDTO = QueryEntitySiger<
  OrderItemFields,
  OrderItemExtraFields
>;

export interface IOrderItemRepository {
  getAll(query: QueryOrderItemDTO): Promise<OrderItem[]>;
}
