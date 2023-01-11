import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { Order } from "../model/Order";
import { GetListAll } from "../useCases/GetListAll";
import { IOrderRepository, QueryOrderDTO } from "./types/IOrderRepository";

export class OrderRepository implements IOrderRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
  }: QueryOrderDTO): Promise<Order[]> {
    const orders = await this.getListAll.execute<Order>({
      entity: "order",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
    });

    return orders;
  }
}
