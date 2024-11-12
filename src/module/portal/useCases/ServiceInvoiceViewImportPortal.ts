import * as dayjs from "dayjs";
import { CommissionDocument } from "../../../module/entities/model/CommissionDocument";
import { Seller } from "../../../module/entities/model/Seller";
import { entities } from "../../../module/entities/useCases";
import { apiPortal } from "../../../service/apiPortal";
import { dbSiger } from "../../../service/dbSiger";
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

  invoices: Invoice[];
  releases?: {
    sigla: string;
    description: string;
    value: number;
    type: "credito" | "debito";
  }[];
}

type Invoice = {
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
  type: "duplicata" | "incobraveis" | "devolucao";
};

export class ServiceInvoiceViewImportPortal {
  readonly pageSize = 50000;

  constructor(
    private sendData: SendData,
    private authorizationRepository: AuthorizationRepository
  ) {}

  onNormalizedInvoice(
    data: CommissionDocument[],
    sellerPercentualComissao: number,
    type: "duplicata" | "incobraveis" | "devolucao" | "renegociacaoDividas"
  ): Invoice[] {
    return data.map((item) => ({
      sigla: item.sigemp,
      clientCod: Number(item.clienteCod),
      invoiceNumber: String(item.documentoNumero),
      documentNumber: String(item.documentoNumero),
      sequence: !isNaN(Number(item.documentoDesdobro))
        ? Number(item.documentoDesdobro)
        : undefined,
      commissionPercetage: sellerPercentualComissao,
      priceValue:
        type === "renegociacaoDividas"
          ? Number(item.duplicataValor)
          : Number(item.baseComissaoValor),
      commissionValue: Number(item.comissaoValor),
      dueDate: item.dataVencimento,
      emissionDate: item.dataEmissao,
      dtPagamento: item.dataPagamento,
      type: type === "renegociacaoDividas" ? "duplicata" : type,
    }));
  }

  async onNormalize(seller: Seller): Promise<Normalized> {
    // Apuração de comissão
    const data = await entities.commissionInvestigation.findFirst({
      fields: {
        representanteCod: true,
        dataInicialApuracao: true, //period_start
        dataFinalApuracao: true, //period_end
        baseComissao: true, //salePrice - Valor venda
        valorComissaoPrazo: true, //commissionValue - Valor comissao
        baseDevolucao: true, //returnValue - Valor Dev/Incob
        baseIncobraveis: true, //commissionRefunded - Comissao estornada
        comissaoEstornada: true, //commissionRefunded - Comissao estornada
        // saleBalance - Saldo de venda
        baseIRF: true, //IRRFBase - Base IRRF
        saldoComissao: true, //comissionBalance - Saldo Comissao
        valorIRFComissao: true, //IRFValue - IRF venda
        valorLiquido: true, //liquidComission - Liquido
        debitoLancados: true, //releasesBalance - Saldo lancamentos
        creditoLancado: true,
      },
      search: `a.representanteCod in (${seller.representanteCod}) and a.dataInicialApuracao = '2024-09-01'`,
    });

    const startDate = dayjs(data.dataInicialApuracao).format("YYYY-MM-DD");
    const endDate = dayjs(data.dataFinalApuracao).format("YYYY-MM-DD");

    // Lançamentos
    const commissionsLaunches = await entities.commissionsLaunches.findAll({
      fields: {
        valor: true,
        tipo: true,
        descricao: true,
      },
      search: `l.representanteCod = ${seller.representanteCod} and 
              l.dataLancamento >= '${startDate}' and l.dataLancamento <= '${endDate}'
      `,
      pagesize: 99999,
    });

    // Duplicatas - Data de emissão mes correste e sinal positivo
    const duplicatas = await entities.commissionDocuments.findAll({
      fields: {
        sigemp: true, //sigla
        representanteCod: true,
        clienteCod: true,
        documentoNumero: true, //documentNumber
        notaNumero: true, //invoiceNumber
        dataEmissao: true, //emissionDate
        dataPagamento: true, //dueDate
        dataVencimento: true,
        comissaoValor: true,
        baseComissaoValor: true,
        documentoDesdobro: true, // sequence
        comissaoPercentual: true,
        sinal: true,
      },
      search: `
        d.representanteCod = ${seller.representanteCod} and 
        d.dataEmissao >= '${startDate}' and d.dataEmissao <= '${endDate}' and 
        d.sinal > 0`,
      pagesize: 99999,
    });
    // Protesto - pagamento no mes corrente e possui data de protesto
    const protestos = await entities.commissionDocuments.findAll({
      fields: {
        sigemp: true, //sigla
        representanteCod: true,
        clienteCod: true,
        documentoNumero: true, //documentNumber
        notaNumero: true, //invoiceNumber
        dataEmissao: true, //emissionDate
        dataPagamento: true, //dueDate
        dataVencimento: true,
        comissaoValor: true,
        baseComissaoValor: true,
        documentoDesdobro: true, // sequence
        comissaoPercentual: true,
        sinal: true,
      },
      search: `
        d.representanteCod = ${seller.representanteCod} and 
        d.dataProtesto is not null and  
        d.dataPagamento >= '${startDate}' and d.dataPagamento<= '${endDate}' `,
      pagesize: 99999,
    });
    // Renegociação de dividas
    const renegociacaoDividas = await dbSiger.$ExecuteQuery<CommissionDocument>(
      `
      select 
        d.sigemp,d.representanteCod,d.clienteCod,d.documentoNumero,d.notaNumero,d.dataEmissao,d.dataPagamento,d.dataVencimento,d.documentoDesdobro,d.comissaoValor,d.baseComissaoValor,d.comissaoPercentual,d.duplicataValor
      from 01010s005.DEV_DUPLICATAS_INCONAVEIS d
      where d.representanteCod = ${seller.representanteCod} and d.dataPagamento >= '${startDate}' and d.dataPagamento<= '${endDate}'
      ;
      `
    );

    // Incobráveis - protestado no mes corrente
    const incobraveis = await entities.commissionDocuments.findAll({
      fields: {
        sigemp: true, //sigla
        representanteCod: true,
        clienteCod: true,
        documentoNumero: true, //documentNumber
        notaNumero: true, //invoiceNumber
        dataEmissao: true, //emissionDate
        dataPagamento: true, //dueDate
        dataVencimento: true,
        comissaoValor: true,
        baseComissaoValor: true,
        documentoDesdobro: true, // sequence
        comissaoPercentual: true,
        sinal: true,
      },
      search: `
        d.representanteCod = ${seller.representanteCod} and 
        d.dataProtesto >= '${startDate}' and d.dataProtesto <= '${endDate}' `,
      pagesize: 99999,
    });
    // Devolução - data de pagamento mes corrente & sinal negativo
    const devolucoes = await entities.commissionDocuments.findAll({
      fields: {
        sigemp: true, //sigla
        representanteCod: true,
        clienteCod: true,
        documentoNumero: true, //documentNumber
        notaNumero: true, //invoiceNumber
        dataEmissao: true, //emissionDate
        dataPagamento: true, //dueDate
        dataVencimento: true,
        comissaoValor: true,
        baseComissaoValor: true,
        documentoDesdobro: true, // sequence
        comissaoPercentual: true,
        sinal: true,
      },
      search: `
        d.representanteCod = ${seller.representanteCod} and 
        d.dataPagamento >= '${startDate}' and d.dataPagamento <= '${endDate}' and 
        d.sinal < 0`,
      pagesize: 99999,
    });

    const invoices: Invoice[] = [
      ...this.onNormalizedInvoice(
        duplicatas,
        Number(seller.percentualComissao),
        "duplicata"
      ),
      ...this.onNormalizedInvoice(
        protestos,
        Number(seller.percentualComissao),
        "duplicata"
      ),
      ...this.onNormalizedInvoice(
        renegociacaoDividas,
        Number(seller.percentualComissao),
        "renegociacaoDividas"
      ),
      ...this.onNormalizedInvoice(
        incobraveis,
        Number(seller.percentualComissao),
        "incobraveis"
      ),
      ...this.onNormalizedInvoice(
        devolucoes,
        Number(seller.percentualComissao),
        "devolucao"
      ),
    ];

    //Valor venda = Somar valor das duplicatas
    const totalDuplicata = invoices
      .filter((f) => f.type === "duplicata")
      .reduce((previousValue, currentValue) => {
        return previousValue + currentValue.priceValue;
      }, 0);
    //Valor Dev/Incob =  Somar valor Devolução & Incobráveis
    const returnValue =
      Number(data.baseDevolucao) + Number(data.baseIncobraveis);
    //Saldo lançamentos = Consolidando créditos e débitos dos lançamentos
    const releasesBalance =
      Number(data.creditoLancado) - Number(data.debitoLancados);
    //Saldo Venda = Valor da venda subtraído por valor de Valor Dev/Incob
    const saleBalance = +Number(totalDuplicata - returnValue).toFixed(2);
    //Valor comissão = Sando comissão subtraído por valor estornado da comissão
    const commissionValue = +Number(
      Number(data.saldoComissao) + Number(data.comissaoEstornada)
    ).toFixed(2);

    return {
      sellerCod: data.representanteCod,
      type: "comissao",
      period_start: data.dataInicialApuracao,
      period_end: data.dataFinalApuracao,
      salePrice: Number(totalDuplicata),
      commissionValue: +Number(
        Number(data.saldoComissao) + Number(data.comissaoEstornada)
      ).toFixed(2),
      returnValue: returnValue,
      commissionRefunded: Number(data.comissaoEstornada),
      saleBalance: saleBalance,
      IRRFBase: Number(data.baseIRF),
      comissionBalance: Number(data.saldoComissao),
      IRFValue: Number(data.valorIRFComissao),
      liquidComission: Number(data.valorLiquido),
      releasesBalance: releasesBalance,
      commissionPercetage: Number(seller.percentualComissao),
      IrfPercetage: Number(seller.percentualIRRF),
      invoices: invoices,
      releases: commissionsLaunches.map((item) => ({
        sigla: "009",
        description: item.descricao,
        value: Number(item.valor),
        type: item.tipo === "D" ? "debito" : "credito",
      })),
    };
  }

  async send(normalized: Normalized) {
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

          if (normalized.returnValue <= 0) await this.send(normalized);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
