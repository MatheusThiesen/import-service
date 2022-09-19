export class Brand {
  code: number;
  description: string;
  abbreviation: string;
  minimumSaleValue: number;
  minimumInstalmentValue: number;
  email: string;
  situation: number;
  inactivationDate: string;
  lastChangeDate: string;
  lastChangeTime: number;
}
export class BrandFields {
  code?: boolean;
  description?: boolean;
  abbreviation?: boolean;
  minimumSaleValue?: boolean;
  minimumInstalmentValue?: boolean;
  email?: boolean;
  situation?: boolean;
  inactivationDate?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}
export class BrandExtraFields {}
