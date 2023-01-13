import { QueryEntitySiger } from "../../../../service/siger";
import {
  OrderItem,
  OrderItemExtraFields,
  OrderItemFields,
} from "../../model/OrderItem";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryOrderItemDTO = QueryEntitySiger<
  OrderItemFields,
  OrderItemExtraFields
>;

export interface IOrderItemRepository {
  getAll(query: QueryOrderItemDTO): Promise<GetListAllResponse<OrderItem>>;
}
