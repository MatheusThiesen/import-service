import { Product, ProductFields } from "./Product";

export class ItemPriceList {
  identifier: number;
  lastChangeDate: string;
  lastChangeTime: number;

  product: Product;
  priceList: {
    code: number;
    description: string;
    situation: number;
  };
  priceRange: {
    salePrice: number;
  }[];
}
export class ItemPriceListFields {
  identifier?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;

  product?: ProductFields;
  priceList?: {
    code?: boolean;
    description?: boolean;
    situation?: boolean;
  };
  priceRange?: {
    salePrice?: boolean;
  };
}
export class ItemPriceListExtraFields {}
