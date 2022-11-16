import { Product, ProductFields } from "./Product";

export class AccumulatedStock {
  period: number;
  product: Product;
  combination: number;
  physicalQuantity: number;
  reservedQuantity: number;
  orderedQuantity: number;
  lastChangeDate: string;
  lastChangeTime: number;
}
export class AccumulatedStockFields {
  period?: boolean;
  combination?: boolean;
  physicalQuantity?: boolean;
  reservedQuantity?: boolean;
  orderedQuantity?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
  product: ProductFields;
}
export class AccumulatedStockExtraFields {}
