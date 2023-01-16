import { Observable } from "../useCases/observable";
import { SendData } from "../useCases/sendData";

type StockPromptDelivery = {
  produtoCod: number;
  qtdFisica: number;
  qtdReserva: number;
};

export class StocksPromptDelivery {
  readonly entity = "stocksPromptDelivery";

  constructor(private observable: Observable, private sendData: SendData) {}

  async execute() {
    const stocksArr = await this.observable.execute<StockPromptDelivery>({
      entity: this.entity,
    });

    for (const stock of stocksArr) {
      const normalizedData = stock.data.map((item) => ({
        period: "pronta-entrega",
        name: "Pronta Entrega",
        productCod: item.produtoCod,
        qtd: Math.trunc(Number(item.qtdFisica) - Number(item.qtdReserva)),
      }));

      await this.sendData.execute({
        file: stock.file,
        entity: this.entity,
        route: "/stock-locations/import",
        data: normalizedData,
      });
    }
  }
}
