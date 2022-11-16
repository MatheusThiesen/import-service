import { entities } from "../../entities/useCases/index";
import { SendData } from "../repositories/SendData";

interface GridPortalSendProps {
  codigo: number;
  descricao: string;
  sequencia: string;
  tamanho: string;
  quantidade: string;
  ativo: "N" | "S";
}

export class GridImportPortal {
  constructor(private sendData: SendData) {}

  async execute() {
    const grids = await entities.grid.getAll({
      fields: {
        code: true,
        size: true,
        abbreviation: true,
        active: true,
        description: true,
      },
      // search: 'lastChangeDate IN ( "19/09/2022")',
      search: "code IN (1)",
    });

    const gridsNormalized: GridPortalSendProps[] = grids.map((grid) => ({
      codigo: grid.code,
      descricao: grid.description,
      ativo: grid.active ? "S" : "N",
      quantidade: "",
      sequencia: "",
      tamanho: "",
    }));

    await this.sendData.post("/product/import", gridsNormalized);
  }
}
