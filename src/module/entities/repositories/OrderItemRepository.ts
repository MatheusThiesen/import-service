import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { OrderItem } from "../model/OrderItem";
import { GetListAll } from "../useCases/GetListAll";
import {
  IOrderItemRepository,
  QueryOrderItemDTO,
} from "./types/IOrderItemRepository";

export class OrderItemRepository implements IOrderItemRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
  }: QueryOrderItemDTO): Promise<OrderItem[]> {
    const items = await this.getListAll.execute<OrderItem>({
      entity: "items",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
      limit: 500,
    });

    return items;
  }
}
