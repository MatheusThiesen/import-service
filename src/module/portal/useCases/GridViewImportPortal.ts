import { entities } from "../../entities/useCases/index";
import { SendData } from "../repositories/SendData";

interface GridPortalSendProps {
  codGrade: number;
  descricaoGrade: string;
  ativo: "N" | "S";
  c1: string;
  c2?: string;
  c3?: string;
  c4?: string;
  c5?: string;
  c6?: string;
  c7?: string;
  c8?: string;
  c9?: string;
  c10?: string;
  c11?: string;
  c12?: string;
  c13?: string;
  c14?: string;
  c15?: string;
  c16?: string;
  c17?: string;
  c18?: string;
  c19?: string;
}

export class GridViewImportPortal {
  constructor(private sendData: SendData) {}

  async execute({ search }: { search?: string }) {
    const whereNormalized = search ? `where ${search}` : ``;

    const grids = await entities.gridProduct.findAll({
      fields: {
        codigo: true,
        descricao: true,
        ativo: true,
        c1: true,
        c2: true,
        c3: true,
        c4: true,
        c5: true,
        c6: true,
        c7: true,
        c8: true,
        c9: true,
        c10: true,
        c11: true,
        c12: true,
        c13: true,
        c14: true,
        c15: true,
        c16: true,
        c17: true,
        c18: true,
        c19: true,
      },
      search: whereNormalized,
    });

    const gridsNormalized: GridPortalSendProps[] = grids.map((grid) => ({
      codGrade: grid.codigo,
      descricaoGrade: grid.descricao,
      ativo: grid.ativo ? "S" : "N",
      c1: grid.c1 && grid.c1 !== "." ? String(grid.c1) : undefined,
      c2: grid.c2 && grid.c2 !== "." ? String(grid.c2) : undefined,
      c3: grid.c3 && grid.c3 !== "." ? String(grid.c3) : undefined,
      c4: grid.c4 && grid.c4 !== "." ? String(grid.c4) : undefined,
      c5: grid.c5 && grid.c5 !== "." ? String(grid.c5) : undefined,
      c6: grid.c6 && grid.c6 !== "." ? String(grid.c6) : undefined,
      c7: grid.c7 && grid.c7 !== "." ? String(grid.c7) : undefined,
      c8: grid.c8 && grid.c8 !== "." ? String(grid.c8) : undefined,
      c9: grid.c9 && grid.c9 !== "." ? String(grid.c9) : undefined,
      c10: grid.c10 && grid.c10 !== "." ? String(grid.c10) : undefined,
      c11: grid.c11 && grid.c11 !== "." ? String(grid.c11) : undefined,
      c12: grid.c12 && grid.c12 !== "." ? String(grid.c12) : undefined,
      c13: grid.c13 && grid.c13 !== "." ? String(grid.c13) : undefined,
      c14: grid.c14 && grid.c14 !== "." ? String(grid.c14) : undefined,
      c15: grid.c15 && grid.c15 !== "." ? String(grid.c15) : undefined,
      c16: grid.c16 && grid.c16 !== "." ? String(grid.c16) : undefined,
      c17: grid.c17 && grid.c17 !== "." ? String(grid.c17) : undefined,
      c18: grid.c18 && grid.c18 !== "." ? String(grid.c18) : undefined,
      c19: grid.c19 && grid.c19 !== "." ? String(grid.c19) : undefined,
    }));

    await this.sendData.post("/product/grid/import", gridsNormalized);
  }
}
