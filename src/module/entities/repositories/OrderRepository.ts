import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { Order } from "../model/Order";
import {
  IOrderRepository,
  QueryOrderCountDTO,
  QueryOrderFindAllDTO,
} from "./types/IOrderRepository";

export class OrderRepository implements IOrderRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryOrderCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.dev_pedido p         
            ${this.whereNormalized(query.search)};
          `
        )
      )[0].total
    );

    return totalItems;
  }

  async findAll({
    fields,
    search,
    page = 0,
    pagesize = 200,
  }: QueryOrderFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const Orders = await dbSiger.$ExecuteQuery<Order>(
      `
      select 
        ${filterFieldsNormalized(fields, "p")}
      from 01010s005.dev_pedido p        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return Orders.map((order) => ({
      ...order,
      posicaoTratada:
        fields.posicaoDescricao &&
        fields.posicaoDetalhadaDescicao &&
        fields.posicaoDetalhadaCod
          ? Number(order.posicaoDetalhadaCod) === 5
            ? order.posicaoDescricao
            : order.posicaoDetalhadaDescicao
          : undefined,
    }));
  }
}
