import { Observable } from "../useCases/observable";
import { SendData } from "../useCases/sendData";

type OrderItem = {
  codigo: number;
  abreviacao: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  situation: number;
  isGerente: string;
  isSupervisor: string;
  codGerente: number;
  codSupervisor: number;
};

export class Sellers {
  readonly entity = "sellers";

  constructor(private observable: Observable, private sendData: SendData) {}

  async execute() {
    const itemsArr = await this.observable.execute<OrderItem>({
      entity: this.entity,
    });

    for (const items of itemsArr) {
      const normalizedData = items.data.map((item) => ({
        codigo: item.codigo,
        marcasCod: ``,
        codGerente: item.codGerente ?? "",
        codSupervisor: item.codSupervisor ?? "",
        nome: item.nomeCompleto ?? "",
        nomeGuerra: item.abreviacao ?? "",
        email: item.email ?? "",
        situation: item.situation ?? "",
        eGerente: item.isGerente?.toLocaleUpperCase() === "SIM" ? `s` : `n`,
        eSupervisor:
          item.isSupervisor?.toLocaleUpperCase() === "SIM" ? `s` : `n`,
      }));

      await this.sendData.execute({
        file: items.file,
        entity: this.entity,
        route: "/sellers/import",
        data: normalizedData,
      });
    }
  }
}
