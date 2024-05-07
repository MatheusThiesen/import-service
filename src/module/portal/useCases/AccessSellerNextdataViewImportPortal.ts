import { dbNextdata } from "../../../service/dbNextdata";
import { SendData } from "../repositories/SendData";

interface GetSeller {
  codigo: number;
  email: string;
  senha: string;
}

interface SendSeller {
  representanteCod: number;
  nextdataLogin: string;
  nextdataPassword: string;
}

export class AccessSellerNextdataViewImportPortal {
  readonly pageSize = 2000;

  constructor(private sendData: SendData) {}

  async onNormalizedOrder(sellers: GetSeller[]): Promise<SendSeller[]> {
    return sellers.map((seller) => ({
      representanteCod: seller.codigo,
      nextdataLogin: seller.email,
      nextdataPassword: seller.senha,
    }));
  }

  async sendSeller(sellers: GetSeller[]) {
    const normalized = await this.onNormalizedOrder(sellers);

    await this.sendData.post("/seller/import/nextdata", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const where = `where c.EMAIL is not null and u.SENHA is not null and c.EMAIL != '' and u.SENHA != '0'`;
      const whereNormalized = search ? `${where} and ${search}` : where;

      const totalItems = Number(
        (
          await dbNextdata.$ExecuteQuery<{ total: string }>(
            `
            select count(*) as "total" from CRM_CONTATO c
            inner join SIS_USUARIO u on u.ID_CONTATO = c.CONTATO_ID
            ${whereNormalized};
            `
          )
        )[0].total
      );

      const totalPage = Math.ceil(totalItems / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const limit = this.pageSize;
        const offset = this.pageSize * index;

        const sellers = await dbNextdata.$ExecuteQuery<GetSeller>(
          `
          select c.CONTATO_ID as "codigo", c.EMAIL as "email",u.SENHA as "senha"  from CRM_CONTATO c
          inner join SIS_USUARIO u on u.ID_CONTATO = c.CONTATO_ID
          ${whereNormalized}
          order by c.CONTATO_ID
          OFFSET ${offset} ROWS
          FETCH NEXT ${limit} ROWS ONLY;
          `
        );

        await this.sendSeller(sellers);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
