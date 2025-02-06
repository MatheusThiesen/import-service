import { entities } from "../../entities/useCases";
import { SendDataRepository } from "../repositories/SendDataRepository";
import { ExecuteServiceProps } from "../types/ExecuteService";

export class BilletImportCommerce {
  readonly pagesize = 800;

  constructor(private sendData: SendDataRepository) {}

  async execute({ search }: ExecuteServiceProps) {
    try {
      const defaultQuery = `t.idTipoDoc = 'O' 
		and t.numBoleto > 0 
    and t.locCob in (21,43,18,33,56,28,61,23,27,239,39,34,55,9,8,63)
		and t.situacao in (1, 14)`;

      const query = search ? `${defaultQuery} and ${search}` : defaultQuery;

      const totalItems = await entities.billet.count({ search: query });
      const totalPages = Math.ceil(totalItems / this.pagesize);

      for (let index = 0; index < totalPages; index++) {
        const page = index;

        const billet = await entities.billet.findAll({
          fields: {
            numero: true,
            valor: true,
            sequencia: true,
            parcela: true,
            numBoleto: true,
            dtVencimento: true,
            dtPagamento: true,
            clienteCod: true,
            representanteCod: true,
            ordem: true,
          },

          search: query,

          page: page,
          pagesize: this.pagesize,
        });

        await this.sendData.post(
          "/billets/import",

          billet.map((item) => ({
            numeroDocumento: item.numero,
            valor: item.valor,
            desdobramento: Number(item.ordem ?? 0),
            parcela: item.parcela,
            nossoNumero: Number(item.numBoleto),
            dataVencimento: item.dtVencimento
              ? new Date(item.dtVencimento).toISOString()
              : undefined,
            dataPagamento: item.dtPagamento
              ? new Date(item.dtPagamento).toISOString()
              : undefined,
            vendedorCodigo: item.representanteCod,
            clienteCodigo: item.clienteCod,
          }))
        );
      }
    } catch (error) {
      console.log("[BILLET][ERRO]");
    }
  }
}
