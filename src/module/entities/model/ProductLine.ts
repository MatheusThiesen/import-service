export class ProductLine {
  lineCode: number;
  lineDescription: string;
  lineAbbreviation: string;
  lineSituation: number;
  productLineInactivationDate: string;
  lastChangeDate: string;
  lastChangeTime: number;
}

export class ProductLineExtraFields {}

export class ProductLineFields {
  lineCode?: boolean;
  lineDescription?: boolean;
  lineAbbreviation?: boolean;
  lineSituation?: boolean;
  productLineInactivationDate?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}
