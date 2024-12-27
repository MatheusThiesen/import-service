import { entities } from "../../..//module/entities/useCases";
import { dbPortal } from "../../../service/dbPortal";
import { SendData } from "../repositories/SendData";

interface GetDevolution {
  id: number;
  numberInvoice: string;
}

interface SendBillet {
  devolution: number;
  invoice: string;
  suspended: boolean;
}

export class SuspendedInvoiceViewImportPortal {
  readonly pageSize = 1000;

  constructor(private sendData: SendData) {}

  async normalized(data: GetDevolution[]) {
    const normalized = data
      .filter((f) => !isNaN(Number(f.numberInvoice)))
      .filter((f) => Number(f.numberInvoice) > 0)
      .map(async (devolution) => {
        const billets = await entities.billet.findAll({
          fields: {
            locCob: true,
          },
          search: `t.numero = ${Number(devolution.numberInvoice)}`,
        });

        if (billets.length > 1) {
          return {
            devolution: devolution.id,
            invoice: devolution.numberInvoice,
            suspended:
              billets.filter((f) => f.locCob === 49 || f.locCob === 63).length >
              0,
          };
        }
      });

    return await Promise.all(normalized);
  }
  async send(data: SendBillet[]) {
    if (data.length > 0)
      await this.sendData.post("/devolution/suspended-invoice-import", data);
  }

  getPageData(data: GetDevolution[], page: number, pageSize: number) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex); // Retorna os itens da página atual
  }

  async execute({ search }: { search?: string }) {
    const whereNormalized = search ? `where ${search} ` : ``;

    try {
      const devolutions = await dbPortal.$ExecuteQuery<GetDevolution>(
        `select
            d.id,
            d."numberInvoice"
          from devolution d
          ${whereNormalized}
          order by d.id desc`
      );
      const totalPage = Math.ceil(devolutions.length / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const devolution = this.getPageData(
          devolutions,
          index + 1,
          this.pageSize
        );

        const normalized = await this.normalized(devolution);

        await this.send(
          normalized
            .filter((item) => item)
            .map((item) => ({
              devolution: item.devolution,
              invoice: item.invoice,
              suspended: item.suspended,
            }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
