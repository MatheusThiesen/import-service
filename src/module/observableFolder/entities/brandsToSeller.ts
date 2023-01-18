import { groupByObject } from "../../../helpers/groupByObject";
import { Observable } from "../useCases/observable";
import { SendData } from "../useCases/sendData";

type OrderItem = {
  codRepresentante: number;
  codMarca: number;
  situacao: string;
};

export class BrandsToSeller {
  readonly entity = "brandsToSeller";

  constructor(private observable: Observable, private sendData: SendData) {}

  async execute() {
    const itemsArr = await this.observable.execute<OrderItem>({
      entity: this.entity,
    });

    for (const items of itemsArr) {
      const normalizedData = items.data.map((item) => ({
        codigo: item.codRepresentante,
        marcasCod: item.codMarca,
      }));

      const groupSeller = groupByObject(normalizedData, (e) => e.codigo);
      const normalizedGroup = groupSeller.map((groupSeller) => ({
        codigo: groupSeller.value,
        marcasCod: groupSeller.data.map((brand) => brand.marcasCod).join(`,`),
      }));

      await this.sendData.execute({
        file: items.file,
        entity: this.entity,
        route: "/sellers/import",
        data: normalizedGroup,
      });
    }
  }
}
