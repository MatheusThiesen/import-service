export class FinancialDocument {
  customer: {
    code: number;
  };
  representative: {
    code: number;
  };
  paymentLocal: {
    code: number;
  };
  documentNumber: number;
  amount: number;
  dueDate: string;
  paymentPosition: string;
  installment: string;
  partialPayment: number;
  sequential: number;
  documentType: string;
  flowDate: string;
  financialDocumentCategory: number;
  paymentType?: number;
  interest?: number;
  discount?: number;
  interestDescriptionCode?: number;
  discountDescriptionCode?: string;
  contract?: string;
  lastChangeDate: string;
  lastChangeTime: number;
}
export class FinancialDocumentFields {
  customer?: {
    code?: boolean;
  };
  representative?: {
    code?: boolean;
  };
  paymentLocal?: {
    code?: boolean;
  };
  documentNumber?: boolean;
  amount?: boolean;
  dueDate?: boolean;
  paymentPosition?: boolean;
  installment?: boolean;
  partialPayment?: boolean;
  sequential?: boolean;
  documentType?: boolean;
  flowDate?: boolean;
  financialDocumentCategory?: boolean;
  paymentType?: boolean;
  interest?: boolean;
  discount?: boolean;
  interestDescriptionCode?: boolean;
  discountDescriptionCode?: boolean;
  contract?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}
export class FinancialDocumentFieldsExtraFields {}
