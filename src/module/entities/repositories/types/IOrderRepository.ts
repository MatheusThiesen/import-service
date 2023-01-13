import { QueryEntitySiger } from "../../../../service/siger";
import { Order, OrderExtraFields, OrderFields } from "../../model/Order";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryOrderDTO = QueryEntitySiger<OrderFields, OrderExtraFields>;

export interface IOrderRepository {
  getAll(query: QueryOrderDTO): Promise<GetListAllResponse<Order>>;
}
