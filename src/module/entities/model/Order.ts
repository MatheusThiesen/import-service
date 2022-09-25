import { Customer, CustomerFields } from "./Customer";
import { OrderItem, OrderItemFields } from "./OrderItem";

export interface Observation {
  identifier: number;
  text: string;
}
export interface ObservationFields {
  identifier?: boolean;
  text?: boolean;
}

export class Order {
  code: number;
  positionOrder: number;
  phase: {
    code: number;
    description: string;
    abbreviation: string;
    lastChangeDate: string;
    lastChangeTime: number;
  };
  customer: Customer;
  orderCategory: {
    code: number;
    description: string;
    abbreviation: string;
    lastChangeDate: string;
    lastChangeTime: number;
  };
  paymentMethod: number;
  entryDate: string;
  entryTime: number;
  deliveryDate: string;
  orderType: number;
  paymentLocal: {
    code: number;
    description: string;
    abbreviation: string;
    lastChangeDate: string;
    lastChangeTime: number;
  };
  payment: {
    code: number;
  };
  percentIncreaseReduction: number;
  burdenFinancial: number;
  specialDiscountCode: number;
  specialDiscountCode2: number;
  currencyType: {
    code: number;
    description: string;
    abbreviation: string;
    lastChangeDate: string;
    lastChangeTime: number;
  };
  useForeignCurrencies: number;
  carrier: {
    code: number;
  };
  freightRate: number;
  redispatchingCarrier: {
    code: number;
  };
  redispatchingFreight: number;
  freightAmount: number;
  insuranceAmount: number;
  ancillaryExpensesAmount: number;
  financialExpensesAmount: number;
  deliveryPlaceCode: number;
  transportRoute: number;
  separator: {
    code: number;
    description: string;
    abbreviation: string;
    badgeCode: number;
    email: string;
    active: number;
    phoneNumber: number;
    cellPhoneNumber: number;
    lastChangeDate: string;
    lastChangeTime: number;
  };
  lecturer: {
    code: number;
    description: string;
    abbreviation: string;
    badgeCode: number;
    email: string;
    active: number;
    phoneNumber: number;
    cellPhoneNumber: number;
    lastChangeDate: string;
    lastChangeTime: number;
  };
  invoiceAmount: number;
  specialDiscountAmount: number;
  specialDiscountAmount2: number;
  discountAmount: number;
  invoiceIcmsValue: number;
  icmsStValue: number;
  ipiValue: number;
  lastChangeDate: string;
  lastChangeTime: number;
  externalIdOrder: number;
  representative: number;
  agent: number;
  salesman: number;
  destacadoresDescriptions: string;
  destacadoresTags: string;
  invoiceSeries: string;
  additionalOrderData1: {
    presencePurchaser: number;
    observationIdOrder: Observation;
    observationExternalIdOrder: Observation;
    observationIdDeliveryPlace: Observation;
    observationIdCommercial: Observation;
    observationIdFinancial: Observation;
    lastChangeDate: string;
    lastChangeTime: number;
  };
  additionalOrderData2: {
    orderCode: Order;
    daysToAddDeadline: number;
    triangularCustomerCode: Customer;
    freightQuote: number;
    observationIdFreight: Observation;
    creditCardTransactionCode: number;
    intermediator: Customer;
    daysToAddCommercialDeadline: number;
    pickUpLocation: Customer;
    lastChangeDate: string;
    lastChangeTime: number;
  };
  items: OrderItem[];
  orderInstallments: {
    sequential: number;
    dueDate: string;
    paymentTerm: number;
    value: number;
    lastChangeDate: string;
    lastChangeTime: number;
  }[];
}
export class OrderFields {
  code?: boolean;
  positionOrder?: boolean;
  phase?: {
    code?: boolean;
    description?: boolean;
    abbreviation?: boolean;
    lastChangeDate?: boolean;
    lastChangeTime?: boolean;
  };
  customer?: CustomerFields;
  orderCategory?: {
    code?: boolean;
    description?: boolean;
    abbreviation?: boolean;
    lastChangeDate?: boolean;
    lastChangeTime?: boolean;
  };
  paymentMethod?: boolean;
  entryDate?: boolean;
  entryTime?: boolean;
  deliveryDate?: boolean;
  orderType?: boolean;
  paymentLocal?: {
    code?: boolean;
    description?: boolean;
    abbreviation?: boolean;
    lastChangeDate?: boolean;
    lastChangeTime?: boolean;
  };
  payment?: {
    code?: boolean;
  };
  percentIncreaseReduction?: boolean;
  burdenFinancial?: boolean;
  specialDiscountCode?: boolean;
  specialDiscountCode2?: boolean;
  currencyType?: {
    code?: boolean;
    description?: boolean;
    abbreviation?: boolean;
    lastChangeDate?: boolean;
    lastChangeTime?: boolean;
  };
  useForeignCurrencies?: boolean;
  carrier?: {
    code?: boolean;
  };
  freightRate?: boolean;
  redispatchingCarrier?: {
    code?: boolean;
  };
  redispatchingFreight?: boolean;
  freightAmount?: boolean;
  insuranceAmount?: boolean;
  ancillaryExpensesAmount?: boolean;
  financialExpensesAmount?: boolean;
  deliveryPlaceCode?: boolean;
  transportRoute?: boolean;
  separator?: {
    code?: boolean;
    description?: boolean;
    abbreviation?: boolean;
    badgeCode?: boolean;
    email?: boolean;
    active?: boolean;
    phoneNumber?: boolean;
    cellPhoneNumber?: boolean;
    lastChangeDate?: boolean;
    lastChangeTime?: boolean;
  };
  lecturer?: {
    code?: boolean;
    description?: boolean;
    abbreviation?: boolean;
    badgeCode?: boolean;
    email?: boolean;
    active?: boolean;
    phoneNumber?: boolean;
    cellPhoneNumber?: boolean;
    lastChangeDate?: boolean;
    lastChangeTime?: boolean;
  };
  invoiceAmount?: boolean;
  specialDiscountAmount?: boolean;
  specialDiscountAmount2?: boolean;
  discountAmount?: boolean;
  invoiceIcmsValue?: boolean;
  icmsStValue?: boolean;
  ipiValue?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
  externalIdOrder?: boolean;
  representative?: boolean;
  agent?: boolean;
  salesman?: boolean;
  destacadoresDescriptions?: boolean;
  destacadoresTags?: boolean;
  invoiceSeries?: boolean;
  additionalOrderData1?: {
    presencePurchaser?: boolean;
    observationIdOrder?: ObservationFields;
    observationExternalIdOrder?: ObservationFields;
    observationIdDeliveryPlace?: ObservationFields;
    observationIdCommercial?: ObservationFields;
    observationIdFinancial?: ObservationFields;
    lastChangeDate?: boolean;
    lastChangeTime?: boolean;
  };
  additionalOrderData2?: {
    orderCode?: OrderFields;
    daysToAddDeadline?: boolean;
    triangularCustomerCode?: CustomerFields;
    freightQuote?: boolean;
    observationIdFreight?: ObservationFields;
    creditCardTransactionCode?: boolean;
    intermediator?: CustomerFields;
    daysToAddCommercialDeadline?: boolean;
    pickUpLocation?: CustomerFields;
    lastChangeDate?: boolean;
    lastChangeTime?: boolean;
  };
  items?: OrderItemFields;
  orderInstallments?: {
    sequential?: boolean;
    dueDate?: boolean;
    paymentTerm?: boolean;
    value?: boolean;
    lastChangeDate?: boolean;
    lastChangeTime?: boolean;
  }[];
}
export class OrderExtraFields {
  externalIdOrder?: boolean;
  representative?: boolean;
  agent?: boolean;
  salesman?: boolean;
  destacadoresTags?: boolean;
  invoiceSeries?: boolean;
}
