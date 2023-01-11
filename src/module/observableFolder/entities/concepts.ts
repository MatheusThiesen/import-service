import { Observable } from "../useCases/observable";
import { SendData } from "../useCases/sendData";

type Concept = {
  codigo: number;
  descricao: string;
  abreviacao: string;
  situacao: number;
};

export class Concepts {
  readonly entity = "concepts";

  constructor(private observable: Observable, private sendData: SendData) {}

  async execute() {
    const conceptsArr = await this.observable.execute<Concept>({
      entity: this.entity,
    });

    for (const concepts of conceptsArr) {
      const normalizedData = concepts.data.map((concept) => ({
        codigo: concept.codigo,
        descricao: concept.descricao,
        abreviacao: concept.abreviacao,
        situacao: concept.situacao,
      }));

      await this.sendData.execute({
        file: concepts.file,
        entity: this.entity,
        route: "/concepts/import",
        data: normalizedData,
      });
    }
  }
}
