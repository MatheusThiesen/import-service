import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { OrderItem } from "../model/OrderItem";
import {
  IOrderItemRepository,
  QueryOrderItemDTO,
} from "./types/IOrderItemRepository";

export class OrderItemRepository implements IOrderItemRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryOrderItemDTO): Promise<OrderItem[]> {
    const items = await apiSiger.get<SigerDTO<OrderItem>>("/api/v1/get-list", {
      params: {
        entity: "items",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
      },
    });

    return items.data.content;
  }
}
