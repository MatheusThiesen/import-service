export type CommissionDocument = {
  sigemp: string;
  clienteCod: number;
  representanteCod: number;
  dataEmissao: Date;
  dataVencimento: Date;
  dataPagamento: Date;
  notaNumero: number;
  documentoNumero: number;
  lancamento;
  lancamentoDescricao;
  documentoDesdobro: string;
  comissaoPercentual: number;
  comissaoValor: number;
  duplicataValor: number;
  vendaValor: number;
  baseComissaoValor: number;
  sinal: number;
};
export type CommissionDocumentFields = {
  sigemp?: boolean;
  clienteCod?: boolean;
  representanteCod?: boolean;
  dataEmissao?: boolean;
  dataVencimento?: boolean;
  dataPagamento?: boolean;
  notaNumero?: boolean;
  documentoNumero?: boolean;
  lancamento?: boolean;
  lancamentoDescricao?: boolean;
  documentoDesdobro?: boolean;
  comissaoPercentual?: boolean;
  comissaoValor?: boolean;
  duplicataValor?: boolean;
  vendaValor?: boolean;
  baseComissaoValor?: boolean;
  sinal?: boolean;
};
