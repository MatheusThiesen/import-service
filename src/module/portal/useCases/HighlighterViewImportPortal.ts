import {
  Highlighter,
  HighlighterFields,
} from "../../../module/entities/model/Highlighter";
import { entities } from "../../entities/useCases/index";
import { SendData } from "../repositories/SendData";

export class HighlighterViewImportPortal {
  readonly pageSize = 10000;

  constructor(private sendData: SendData) {}

  async execute({ search }: { search?: string }) {
    try {
      const data = await entities.highlighter.findAll<
        HighlighterFields,
        Highlighter
      >({
        fields: {
          tag: true,
          descricao: true,
        },
        search: search,
        pagesize: 99999,
      });

      await this.sendData.post("/highlighter/import", data);
    } catch (error) {
      console.log(error);
    }
  }
}
