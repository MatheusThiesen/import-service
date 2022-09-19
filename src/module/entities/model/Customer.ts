export class Customer {
  code: number;
  situation: number;
  cgc: number;
  name: string;
  fancyName: string;
  longDescription: string;
  phoneNumber?: number;
  phoneNumber2?: number;

  addressZipcode?: number;
  addressState?: string;
  addressCity?: string;
  addressNeighborhood?: string;
  addressStreet?: string;
  addressNumber?: string;

  email?: string;
  invoiceEmail?: string;

  group?: {
    code: number;
  };

  lastChangeDate: string;
  lastChangeTime: number;
}

export class CustomerExtraFields {
  email?: boolean;
  invoiceEmail?: boolean;
}

export class CustomerFields {
  code?: boolean;
  situation?: boolean;
  cgc?: boolean;
  name?: boolean;
  fancyName?: boolean;
  longDescription?: boolean;
  phoneNumber?: boolean;
  phoneNumber2?: boolean;

  addressZipcode?: boolean;
  addressState?: boolean;
  addressCity?: boolean;
  addressNeighborhood?: boolean;
  addressStreet?: boolean;
  addressNumber?: boolean;

  group?: {
    code?: boolean;
  };

  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}
