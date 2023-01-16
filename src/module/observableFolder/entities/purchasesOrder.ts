import { Observable } from "../useCases/observable";
import { SendData } from "../useCases/sendData";

type PurchaseOrder = {
  id: number;
  produtoCod: number;
  dtEmissao: string;
  dtEntrega: string;
  qtdSolicitada: number;
  qtdAberto: number;
  qtdEntregue: number;
  qtdCancelada: number;
  situacao: number;
};

export class PurchasesOrder {
  readonly entity = "purchasesOrder";

  constructor(private observable: Observable, private sendData: SendData) {}

  normalizedMonth(datePeriod: string, type: "period" | "name") {
    const normalizedDate = new Date(datePeriod);
    const day = normalizedDate.toLocaleString("pt-br", {
      day: "2-digit",
    });
    const month = normalizedDate.toLocaleString("pt-br", {
      month: "2-digit",
    });
    const year = normalizedDate.toLocaleString("pt-br", {
      year: "numeric",
    });

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

  async execute() {
    const purchasesArr = await this.observable.execute<PurchaseOrder>({
      entity: this.entity,
    });

    for (const purchases of purchasesArr) {
      const normalizedData = purchases.data.map((purchase) => ({
        cod: purchase.id,
        period: this.normalizedMonth(purchase.dtEntrega, "period"),
        name: this.normalizedMonth(purchase.dtEntrega, "name"),
        productCod: purchase.produtoCod,
        qtd: purchase.qtdAberto,
        status: purchase.situacao,
      }));

      await this.sendData.execute({
        file: purchases.file,
        entity: this.entity,
        route: "/purchases-order/import",
        data: normalizedData,
      });
    }
  }
}
