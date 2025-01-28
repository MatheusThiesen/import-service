import { dbSiger } from "../../../service/dbSiger";
import { SendData } from "../repositories/SendData";

interface GetMicroregion {
  zonaCod: number;
  zona: string;
  microRegiaoCod: number;
  microRegiao: string;
}

interface SendMicroregion {
  zonaCod: number;
  zona: string;
  microRegiaoCod: number;
  microRegiao: string;
}

export class MicroregionsViewImportPortal {
  readonly pageSize = 500;

  constructor(private sendData: SendData) {}

  async onNormalized(data: GetMicroregion[]): Promise<SendMicroregion[]> {
    return data.map((item) => ({
      zonaCod: +item.zonaCod,
      zona: item.zona,
      microRegiaoCod: +item.microRegiaoCod,
      microRegiao: item.microRegiao,
    }));
  }

  async send(ocs: GetMicroregion[]) {
    try {
      const normalized = await this.onNormalized(ocs);

      await this.sendData.post("/microregion/import", normalized);
    } catch (error) {
      console.log(error);
    }
  }

  async execute({ search }: { search?: string }) {
    try {
      const whereNormalized = search ? `where ${search}` : "";

      const totalItems = Number(
        (
          await dbSiger.$ExecuteQuery<{ total: string }>(
            `
              select count(*) as total from 01010s005.DEV_MICRO_REGIAO_VENDA r
              inner join 01010s005.DEV_ZONA_VENDA z on r.zonaCod = z.zonaCod
              ${whereNormalized};
            `
          )
        )[0].total
      );

      const totalPage = Math.ceil(totalItems / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const limit = this.pageSize;
        const offset = this.pageSize * index;

        const data = await dbSiger.$ExecuteQuery<GetMicroregion>(
          `
          select 
            z.zonaCod, 
            z.abreviacao as zona, 
            r.microRegiaoCod,
            r.abreviacao as microRegiao  
          from 01010s005.DEV_MICRO_REGIAO_VENDA r
          inner join 01010s005.DEV_ZONA_VENDA z on r.zonaCod = z.zonaCod
          ${whereNormalized}
          limit ${limit}
          offset ${offset}
          ;
          `
        );

        await this.send(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
