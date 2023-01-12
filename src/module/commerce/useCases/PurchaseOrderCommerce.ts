import { IPurchaseOrderItemsRepository } from "src/module/entities/repositories/types/IPurchaseOrderItemsRepository";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

interface PurchaseOrderNormalized {
  cod: number;
  period: string;
  name: string;
  qtd: number;
  status: number;
}

export class PurchaseOrderCommerce {
  constructor(
    private sendData: SendDataRepository,
    private readonly purchaseOrderItemsRepository: IPurchaseOrderItemsRepository
  ) {}

  private normalizedMonth(datePeriod: string, type: "period" | "name") {
    const [day, month, year] = datePeriod.split("/");

    const dateMonthLong = new Date(`${month}/${day}/${year}`).toLocaleString(
      "pt-br",
      {
        month: "long",
      }
    );

    if (type === "period") {
      return `${month}-${year}`;
    } else {
      return `${
        dateMonthLong[0].toUpperCase() + dateMonthLong.substring(1)
      } ${year}`;
    }
  }

  async execute({ search }: ExecuteServiceProps) {
    const query = `stockLocation.code EQ 20 ${search ? `AND ${search}` : ""}  `;

    const purchasesOrder = await this.purchaseOrderItemsRepository.getAll({
      fields: {
        itemStatus: true,
        purchaseItemID: true,
        deliveryDeadlineDate: true,
        openQuantity: true,
        product: {
          code: true,
        },
      },
      search: query,
    });

    const purchasesOrderNormalized: PurchaseOrderNormalized[] =
      purchasesOrder.map((purchaseOrder) => ({
        cod: purchaseOrder.purchaseItemID,
        period: this.normalizedMonth(
          purchaseOrder.deliveryDeadlineDate,
          "period"
        ),
        name: this.normalizedMonth(purchaseOrder.deliveryDeadlineDate, "name"),
        productCod: purchaseOrder.product.code,
        qtd: purchaseOrder.openQuantity,
        status: purchaseOrder.itemStatus,
      }));

    await this.sendData.post(
      "/purchases-order/import",
      purchasesOrderNormalized
    );
  }
}
