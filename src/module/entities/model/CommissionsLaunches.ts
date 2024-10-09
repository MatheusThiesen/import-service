export type CommissionsLaunches = {
  dataLancamento: Date;
  descricao: string;
  valor: number;
  tipo: "D" | "C";
  representanteCod: number;
};
export type CommissionsLaunchesFields = {
  dataLancamento?: boolean;
  descricao?: boolean;
  valor?: boolean;
  tipo?: boolean;
  representanteCod?: boolean;
};
