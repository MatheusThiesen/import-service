import { OrderItem } from "src/module/entities/model/OrderItem";
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
  readonly size = 1000;

  constructor(
    private sendData: SendDataRepository,
    private readonly orderItemRepository: IOrderItemRepository
  ) {}

  onOrderItemNormalized(ordersItems: OrderItem[]): OrderItemNormalized[] {
    const normalizedDate = (date: string) => {
      const [day, month, year] = date.split("/");
      const newDate = new Date(`${year}-${month}-${day}T00:00`);

      return newDate;
    };

    return ordersItems.map((item) => ({
      pedidoCodigo: item.order.code,
      produtoCodigo: item.product.code,
      dataFaturmaneto: normalizedDate(item.order.deliveryDate),
      cod: item.identifier,
      status: item.positionItem,
      qtd: item.quantity,
      value: item.price,
      valueTotal: item.grossAmount,
    }));
  }

  async execute({ search }: ExecuteServiceProps) {
    const orderItems = await this.orderItemRepository.getAll({
      fields: {
        product: {
          code: true,
        },
        order: {
          code: true,
          deliveryDate: true,
        },
        quantity: true,
        price: true,
        grossAmount: true,
        positionItem: true,
        identifier: true,
      },
      search,
      isPagination: true,
      page: 0,
      size: this.size,
    });

    await this.sendData.post(
      "/order-items/import",
      this.onOrderItemNormalized(orderItems.content)
    );

    const totalPages = Number(orderItems.totalPages);

    for (let index = 0; index < totalPages; index++) {
      const page = index + 1;

      console.log(`orderItems  ${page} de ${totalPages}`);

      const orderItemsResponse = await await this.orderItemRepository.getAll({
        fields: {
          product: {
            code: true,
          },
          order: {
            code: true,
            deliveryDate: true,
          },
          quantity: true,
          price: true,
          grossAmount: true,
          positionItem: true,
          identifier: true,
        },
        search,
        isPagination: true,
        page: page,
        size: this.size,
      });

      await this.sendData.post(
        "/order-items/import",
        this.onOrderItemNormalized(orderItemsResponse.content)
      );
    }
  }
}
