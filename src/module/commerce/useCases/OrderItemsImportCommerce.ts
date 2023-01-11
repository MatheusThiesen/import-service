import { IOrderItemRepository } from "src/module/entities/repositories/types/IOrderItemRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface OrderItemNormalized {
  cod: number;
  qtd: number;
  value: number;
  valueTotal: number;
  status: number;
  pedidoCodigo: number;
  produtoCodigo: number;
}

export class OrderItemImportCommerce {
  constructor(
    private sendData: SendDataRepository,
    private readonly orderItemRepository: IOrderItemRepository
  ) {}

  async execute({ search }: ExecuteServiceProps) {
    const orderItems = await this.orderItemRepository.getAll({
      fields: {
        product: {
          code: true,
        },
        order: {
          code: true,
        },
        quantity: true,
        price: true,
        grossAmount: true,
        positionItem: true,
        identifier: true,
      },
      search,
    });

    const orderItemsNormalized: OrderItemNormalized[] = orderItems.map(
      (item) => ({
        pedidoCodigo: item.order.code,
        produtoCodigo: item.product.code,
        cod: item.identifier,
        status: item.positionItem,
        qtd: item.quantity,
        value: item.price,
        valueTotal: item.grossAmount,
      })
    );

    await this.sendData.post("/order-items/import", orderItemsNormalized);
  }
}
