import { Observable } from "../useCases/observable";
import { SendData } from "../useCases/sendData";

type Concept = {
  conceitoCod: number;
  grupoCod: number;
  subgrupoCod: number;
};

export class ProductConceptRules {
  readonly entity = "productConceptRules";

  constructor(private observable: Observable, private sendData: SendData) {}

  async execute() {
    const conceptsArr = await this.observable.execute<Concept>({
      entity: this.entity,
    });

    for (const concepts of conceptsArr) {
      const normalizedData = concepts.data.map((concept) => ({
        conceitoCod: concept.conceitoCod,
        grupoCod: concept.grupoCod,
        subgrupoCod: concept.subgrupoCod,
      }));

      await this.sendData.execute({
        file: concepts.file,
        entity: this.entity,
        route: "/product-concept-rules/import",
        data: normalizedData,
      });
    }
  }
}
