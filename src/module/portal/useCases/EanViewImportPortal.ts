import { EanProduct } from "../../..//module/entities/model/EanProduct";
import { entities } from "../../..//module/entities/useCases";
import { SendData } from "../repositories/SendData";

interface SendEan {
  idEan: string;
  codigo: number;
  ean: string;
  codProduto: number;
  codGrade: number;
  decriçãoGrade: string;
  sequencial: number;
  qtd1: number;
  qtd2?: number;
  qtd3?: number;
  qtd4?: number;
  qtd5?: number;
  qtd6?: number;
  qtd7?: number;
  qtd8?: number;
  tipoEmb1?: number;
  tipoEmb2?: number;
  tipoEmb3?: number;
  tipoEmb4?: number;
  tipoEmb5?: number;
  tipoEmb6?: number;
  tipoEmb7?: number;
  tipoEmb8?: number;
}

export class EanViewImportPortal {
  readonly pageSize = 50000;

  constructor(private sendData: SendData) {}

  async sendEan(eans: EanProduct[]) {
    const normalized: SendEan[] = eans.map((ean) => ({
      idEan: String(ean.eanId),
      codigo: Number(
        `${ean.produtoCod}${Number(ean.eanId)}${Number(ean.sequencial)}`
      ),
      ean: ean.ean,
      codProduto: ean.produtoCod,
      codGrade: ean.gradeCod,
      decriçãoGrade: ean.gradeDescricao,
      sequencial: Number(ean.sequencial),
      qtd1: ean.qtd1,
      qtd2: ean.qtd2,
      qtd3: ean.qtd3,
      qtd4: ean.qtd4,
      qtd5: ean.qtd5,
      qtd6: ean.qtd6,
      qtd7: ean.qtd7,
      qtd8: ean.qtd8,
      tipoEmb1: ean.tpEmb1,
      tipoEmb2: ean.tpEmb2,
      tipoEmb3: ean.tpEmb3,
      tipoEmb4: ean.tpEmb4,
      tipoEmb5: ean.tpEmb5,
      tipoEmb6: ean.tpEmb6,
      tipoEmb7: ean.tpEmb7,
      tipoEmb8: ean.tpEmb8,
    }));

    return await this.sendData.post("/product/ean/import", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const totalItems = await entities.eanProduct.count({ search });
      const totalPage = Math.ceil(totalItems / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const eans = await entities.eanProduct.findAll({
          fields: {
            ean: true,
            produtoCod: true,
            gradeCod: true,
            gradeDescricao: true,
            sequencial: true,
            eanId: true,
            qtd1: true,
            qtd2: true,
            qtd3: true,
            qtd4: true,
            qtd5: true,
            qtd6: true,
            qtd7: true,
            qtd8: true,
            tpEmb1: true,
            tpEmb2: true,
            tpEmb3: true,
            tpEmb4: true,
            tpEmb5: true,
            tpEmb6: true,
            tpEmb7: true,
            tpEmb8: true,
          },
          page: index,
          pagesize: this.pageSize,
          search: search,
        });

        await this.sendEan(eans);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
