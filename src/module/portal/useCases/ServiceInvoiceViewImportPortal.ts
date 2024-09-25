import * as dayjs from "dayjs";
import { Seller } from "../../../module/entities/model/Seller";
import { entities } from "../../../module/entities/useCases";
import { apiPortal } from "../../../service/apiPortal";
import { AuthorizationRepository } from "../repositories/Authorization";
import { SendData } from "../repositories/SendData";

interface Normalized {
  sellerCod: number;
  type: string;
  period_start: Date;
  period_end: Date;
  salePrice: number;
  commissionValue: number;
  returnValue: number;
  commissionRefunded: number;
  saleBalance: number;
  IRRFBase: number;
  comissionBalance: number;
  IRFValue: number;
  liquidComission: number;
  releasesBalance: number;
  commissionPercetage: number;
  IrfPercetage: number;

  invoices: {
    sigla: string;
    clientCod: number;
    documentNumber: string;
    sequence: number;
    commissionPercetage: number;
    priceValue: number;
    commissionValue: number;
    dueDate: Date;
    emissionDate: Date;
    dtPagamento: Date;
    type: string;
  }[];
}

export class ServiceInvoiceViewImportPortal {
  readonly pageSize = 50000;

  constructor(
    private sendData: SendData,
    private authorizationRepository: AuthorizationRepository
  ) {}

  async onNormalize(seller: Seller): Promise<Normalized> {
    const data = await entities.commissionInvestigation.findFirst({
      fields: {
        representanteCod: true,
        dataInicialApuracao: true, //period_start
        dataFinalApuracao: true, //period_end
        baseComissao: true, //salePrice - Valor venda
        valorComissaoPrazo: true, //commissionValue - Valor comissao
        baseDevolucao: true, //returnValue - Valor Dev/Incob
        valorDevolucao: true, //commissionRefunded - Comissao estornada
        // saleBalance - Saldo de venda
        baseIRF: true, //IRRFBase - Base IRRF
        saldoComissao: true, //comissionBalance - Saldo Comissao
        valorIRFComissao: true, //IRFValue - IRF venda
        valorLiquido: true, //liquidComission - Liquido
        debitoLancados: true, //releasesBalance - Saldo lancamentos
      },
      search: `a.representanteCod in (${seller.representanteCod}) and a.dataInicialApuracao = '2024-08-01'`,
    });

    const documents = await entities.financialDocument.findAll({
      fields: {
        sigemp: true, //sigla
        representanteCod: true,
        clienteCod: true,
        numero: true, //documentNumber
        dtMovimento: true, //emissionDate
        dtVencimento: true, //dueDate
        valor: true,
        ordem: true, // sequence
        tipo: true,
      },
      search: `f.tipo in ('O', 'D') AND f.representanteCod in (${
        seller.representanteCod
      }) 
                AND f.dtMovimento >= '${dayjs(data.dataInicialApuracao).format(
                  "YYYY-MM-DD"
                )}' 
                AND f.dtMovimento <= '${dayjs(data.dataFinalApuracao).format(
                  "YYYY-MM-DD"
                )}'`,
      pagesize: 10000,
    });

    const invoices = documents.map((item) => ({
      sigla: item.sigemp,
      clientCod: item.clienteCod,
      documentNumber: String(item.numero),
      sequence: isNaN(Number(item.ordem)) ? Number(item.ordem) : undefined,
      commissionPercetage: Number(seller.percentualComissao),
      priceValue: Number(item.valor),
      commissionValue:
        Number(item.valor) * (Number(seller.percentualComissao) / 100),
      dueDate: item.dtVencimento,
      emissionDate: item.dtMovimento,
      dtPagamento: item.dtPagamento,
      type: item.tipo === "D" ? "devolucao" : "duplicata",
      // receiptDate
    }));

    console.log(invoices.length);

    return {
      sellerCod: data.representanteCod,
      type: "comissao",
      period_start: data.dataInicialApuracao,
      period_end: data.dataFinalApuracao,
      salePrice: Number(data.baseComissao),
      commissionValue: Number(data.valorComissaoPrazo),
      returnValue: Number(data.baseDevolucao),
      commissionRefunded: Number(data.valorDevolucao),
      saleBalance: +Number(
        Number(data.baseComissao) - Number(data.baseDevolucao)
      ).toFixed(2),
      IRRFBase: Number(data.baseIRF),
      comissionBalance: Number(data.saldoComissao),
      IRFValue: Number(data.valorIRFComissao),
      liquidComission: Number(data.valorLiquido),
      releasesBalance: Number(data.debitoLancados),
      commissionPercetage: Number(seller.percentualComissao),
      IrfPercetage: Number(seller.percentualIRRF),
      invoices: invoices,
    };
  }

  async sendSeller(normalized: Normalized) {
    const token = (await this.authorizationRepository.singIn()).token;
    apiPortal.defaults.headers["x-access-token"] = `Bearer ${token}`;

    await apiPortal.post("/service-invoice/", normalized);
  }

  async execute({ search }: { search?: string }) {
    try {
      const whereNormalized = search;

      const totalItems = await entities.seller.count({
        search: whereNormalized,
      });

      const totalPage = Math.ceil(totalItems / this.pageSize);

      for (let index = 0; index < totalPage; index++) {
        const limit = this.pageSize;
        const offset = this.pageSize * index;

        const sellers = await entities.seller.findAll({
          search: whereNormalized,
          page: offset,
          pagesize: limit,
          fields: {
            representanteCod: true,
            percentualComissao: true,
            percentualIRRF: true,
          },
        });

        for (const seller of sellers) {
          const normalized = await this.onNormalize(seller);
          await this.sendSeller(normalized);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
