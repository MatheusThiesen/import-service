import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { Order } from "../model/Order";
import { IOrderRepository, QueryOrderDTO } from "./types/IOrderRepository";

export class OrderRepository implements IOrderRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryOrderDTO): Promise<Order[]> {
    const orders = await apiSiger.get<SigerDTO<Order>>("/api/v1/get-list", {
      params: {
        entity: "order",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
      },
    });

    return orders.data.content;
  }
}
