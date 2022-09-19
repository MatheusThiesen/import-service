export class ProductGroup {
  code: number;
  description: string;
  abbreviation: string;
  situation: number;
  inativationDate: string;
  lastChangeDate: string;
  lastChangeTime: number;
}
export class ProductGroupFields {
  code?: boolean;
  description?: boolean;
  abbreviation?: boolean;
  situation?: boolean;
  inativationDate?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}
export class ProductGroupExtraFields {}
