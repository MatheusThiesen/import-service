export class Billet {
  sigeemp: string;
  clienteCod: number;
  representanteCod: number;
  numero: number;
  valor: number;
  dtVencimento: Date;
  ordem: number;
  idTipoDoc: string;
  parcela: number;
  sequencia: number;
  numBoleto: number;
  numBoletoDv: number;
  locCob: number;
  fazRemessa: number;
  banco: number;
  agencia: number;
  dtPagamento?: Date;
  situacao: number;
  dtAlteracao: Date;
}
export class BilletFields {
  sigeemp?: boolean;
  clienteCod?: boolean;
  representanteCod?: boolean;
  numero?: boolean;
  valor?: boolean;
  dtVencimento?: boolean;
  ordem?: boolean;
  idTipoDoc?: boolean;
  parcela?: boolean;
  sequencia?: boolean;
  numBoleto?: boolean;
  numBoletoDv?: boolean;
  locCob?: boolean;
  fazRemessa?: boolean;
  banco?: boolean;
  agencia?: boolean;
  dtPagamento?: boolean;
  situacao?: boolean;
  dtAlteracao?: boolean;
}
