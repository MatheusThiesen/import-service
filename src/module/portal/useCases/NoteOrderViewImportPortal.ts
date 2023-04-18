import { SendData } from "../repositories/SendData";
import { dbSiger } from "./../../../service/dbSiger";

export class NoteOrderViewImportPortal {
  constructor(private sendData: SendData) {}

  async execute({ search }: { search?: string }) {
    const whereNormalized = search ? `where ${search}` : ``;

    const notesOrder = await dbSiger.$ExecuteQuery<{
      numeroNota: number;
      pedidoCod: number;
      // chaveNota: string;
    }>(`
      select distinct 
            n.numeroNota,
            n.pedidoCod,
      from 01010s005.dev_pedido_nota n 
      ${whereNormalized};
    `);

    const normalized = notesOrder.map((note) => ({
      orderCod: note.pedidoCod,
      documentNumber: note.numeroNota,
      // keyNfe: note.chaveNota,
    }));

    await this.sendData.post("/order/nf/import", normalized);
  }
}

// const notesOrder = await dbSiger.$ExecuteQuery<{
//   numeroNota: number;
//   pedidoCod: number;
//   // chaveNota: string;
// }>(`
//   select distinct
//         n.numeroNota,
//         n.pedidoCod,
//         concat(
//           LPAD(nChave.cUF, 2, '0'),
//           LPAD(nChave.ano, 2, '0'),
//           LPAD(nChave.mes, 2, '0'),
//           LPAD(nChave.CNPJ, 14, '0'),
//           LPAD(nChave.mod, 2, '0'),
//           LPAD(nChave.serie, 3, '0'),
//           LPAD(nChave.nNF, 9, '0'),
//           LPAD(nChave.tpEmis, 1, '0'),
//           LPAD(nChave.cNF, 8, '0'),
//           LPAD(nChave.cDV, 1, '0')
//           ) as chaveNota
//   from 01010s005.dev_pedido_nota n
//   left join 01010s005.DEV_NOTA_CHAVE nChave on nChave.nNF = n.numeroNota
//   ${whereNormalized};
// `);
