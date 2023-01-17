import { Observable } from "../useCases/observable";
import { SendData } from "../useCases/sendData";

type OrderItem = {
  pedidoCod: number;
  produtoCod: number;
  situacao: number;
  qtd: number;
  dtFaturamento: Date;
  vlrUnitario: number;
  vlrTotal: number;
  sequencia: number;
};

export class OrdersItems {
  readonly entity = "ordersItems";

  constructor(private observable: Observable, private sendData: SendData) {}

  async execute() {
    const itemsArr = await this.observable.execute<OrderItem>({
      entity: this.entity,
    });

    for (const items of itemsArr) {
      const normalizedData = items.data.map((item) => ({
        pedidoCodigo: item.pedidoCod,
        produtoCodigo: item.produtoCod,
        dataFaturmaneto: item.dtFaturamento,
        cod: `${item.pedidoCod}${item.produtoCod}${item.sequencia}`,
        status: item.situacao,
        qtd: item.qtd,
        value: item.vlrUnitario,
        valueTotal: item.vlrTotal,
        sequencia: item.sequencia,
      }));

      await this.sendData.execute({
        file: items.file,
        entity: this.entity,
        route: "/order-items/import",
        data: normalizedData,
      });
    }
  }
}
