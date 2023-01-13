import { PurchaseOrderItems } from "../../../module/entities/model/PurchaseOrderItems";
import { IPurchaseOrderItemsRepository } from "../../../module/entities/repositories/types/IPurchaseOrderItemsRepository";
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
  readonly size = 1000;

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

  private onPurchasesOrderNormalized(purchasesOrder: PurchaseOrderItems[]) {
    return purchasesOrder.map((purchaseOrder) => ({
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
      isPagination: true,
      page: 0,
      size: this.size,
    });

    await this.sendData.post(
      "/purchases-order/import",
      this.onPurchasesOrderNormalized(purchasesOrder.content)
    );

    const totalPages = Number(purchasesOrder.totalPages);

    for (let index = 0; index < totalPages; index++) {
      const page = index + 1;

      console.log(`purchases-order  ${page} de ${totalPages}`);

      const purchasesOrderResponse =
        await this.purchaseOrderItemsRepository.getAll({
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
          isPagination: true,
          page: page,
          size: this.size,
        });

      await this.sendData.post(
        "/purchases-order/import",
        this.onPurchasesOrderNormalized(purchasesOrderResponse.content)
      );
    }
  }
}
