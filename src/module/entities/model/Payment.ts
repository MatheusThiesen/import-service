export class Payment {
  code: number;
  description: string;
  abbreviation: string;
  instalments: number;
  paymentMethod: string;
  paymentOptions: number;
  due: number;
  lastChangeDate: string;
  lastChangeTime: number;
}
export class PaymentFields {
  code?: boolean;
  description?: boolean;
  abbreviation?: boolean;
  instalments?: boolean;
  paymentMethod?: boolean;
  paymentOptions?: boolean;
  due?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}
export class PaymentFieldsExtraFields {}
