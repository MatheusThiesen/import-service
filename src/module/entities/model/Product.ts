import { Grid, GridFields } from "./Grid";

export class Product {
  code: number;
  alternateCode: string;
  group: {
    code: number;
  };
  subgroup: {
    code: number;
  };
  type: number;
  EANCode: number;
  reference: string;
  accountAssignment: number;
  description: string;
  additionalDescription: string;
  completeDescription: string;
  unitMeasure: {
    unit: string;
    description: string;
    abbreviation: string;
  };
  taxClassification: number;
  configurableField: string;
  minimumSaleQuantity: number;
  replacementPrice: number;
  acquisitionCost: number;
  managementCost: number;
  salePrice: number;
  maximumDiscountPercentage: number;
  maximumIncreasePercentage: number;
  saleLimitDate: string;
  promotionalPrice: number;
  promotionalPriceStartDate: string;
  promotionalPriceFinalDate: string;
  commodityOrigin: number;
  freightPercentage: number;
  percentageIpi: number;
  IpiInValue: number;
  percentageIcms: number;
  productLine: {
    lineCode: number;
  };
  collection: {
    collectionCode: number;
  };
  predominantColor: {
    colorCode: number;
  };
  materialGroup: {
    code: number;
  };
  grid: Grid;
  secondUnit: {
    unit: string;
  };
  thickness: number;
  width: number;
  initialMeasure: number;
  finalMeasure: number;
  resupply: number;
  minimumLotProduction: number;
  defaultStockLocal: {
    code: number;
  };
  stockMaximumQuantity: number;
  spareTime: number;
  quarantineTime: number;
  costCenter: {
    code: number;
  };
  defaultProvider: {
    code: number;
  };
  situation: number;
  inactivationDate: string;
  blockedPurchase: number;
  blockedSale: number;
  inclusionDate: string;
  inclusionTime: number;
  manufacturer: {
    manufacturerCode: number;
  };
  brand: {
    code: number;
  };
  unitWeight: number;
  packagingType: {
    code: number;
    description: number;
    abbreviation: string;
  };
  packagingQuantity: number;
  blockedProduction: number;

  secondColor: {
    colorCode: number;
  };
  productionLine: {
    code: number;
  };
  maximumLotProduction: number;
  IDApplication: {
    identifier: number;
    text: string;
  };
  groupId: number;
  purchaseMinimumQuantity: number;
  bulk: number;
  stockMinimumQuantity: number;
  regulatoryQuantity: number;
  spareQuantity: number;
  lastChangeDate: string;
  lastChangeTime: number;
  firstSize: string;
  freeStock: number;
  consolidatedFreeStock: number;
}

export class ProductExtraFields {
  firstSize?: boolean;
  freeStock?: boolean;
  consolidatedFreeStock?: boolean;
}

export class ProductFields {
  code?: boolean;
  alternateCode?: boolean;
  group?: {
    code?: boolean;
  };
  subgroup?: {
    code?: boolean;
  };
  type?: boolean;
  EANCode?: boolean;
  reference?: boolean;
  accountAssignment?: boolean;
  description?: boolean;
  additionalDescription?: boolean;
  completeDescription?: boolean;
  unitMeasure?: {
    unit?: boolean;
    description?: boolean;
    abbreviation?: boolean;
  };
  taxClassification?: boolean;
  configurableField?: boolean;
  minimumSaleQuantity?: boolean;
  replacementPrice?: boolean;
  acquisitionCost?: boolean;
  managementCost?: boolean;
  salePrice?: boolean;
  maximumDiscountPercentage?: boolean;
  maximumIncreasePercentage?: boolean;
  saleLimitDate?: boolean;
  promotionalPrice?: boolean;
  promotionalPriceStartDate?: boolean;
  promotionalPriceFinalDate?: boolean;
  commodityOrigin?: boolean;
  freightPercentage?: boolean;
  percentageIpi?: boolean;
  IpiInValue?: boolean;
  percentageIcms?: boolean;
  productLine?: {
    lineCode?: boolean;
  };
  collection?: {
    collectionCode?: boolean;
  };
  predominantColor?: {
    colorCode?: boolean;
  };
  materialGroup?: {
    code?: boolean;
  };
  grid?: GridFields;
  secondUnit?: {
    unit?: boolean;
  };
  thickness?: boolean;
  width?: boolean;
  initialMeasure?: boolean;
  finalMeasure?: boolean;
  resupply?: boolean;
  minimumLotProduction?: boolean;
  defaultStockLocal?: {
    code?: boolean;
  };
  stockMaximumQuantity?: boolean;
  spareTime?: boolean;
  quarantineTime?: boolean;
  costCenter?: {
    code?: boolean;
  };
  defaultProvider?: {
    code?: boolean;
  };
  situation?: boolean;
  inactivationDate?: boolean;
  blockedPurchase?: boolean;
  blockedSale?: boolean;
  inclusionDate?: boolean;
  inclusionTime?: boolean;
  manufacturer?: {
    manufacturerCode?: boolean;
  };
  brand?: {
    code?: boolean;
  };
  unitWeight?: boolean;
  packagingType?: {
    code?: boolean;
    description?: boolean;
    abbreviation?: boolean;
  };
  packagingQuantity?: boolean;
  blockedProduction?: boolean;

  secondColor?: {
    colorCode?: boolean;
  };
  productionLine?: {
    code?: boolean;
  };
  maximumLotProduction?: boolean;
  IDApplication?: {
    identifier?: boolean;
    text?: boolean;
  };
  groupId?: boolean;
  purchaseMinimumQuantity?: boolean;
  bulk?: boolean;
  stockMinimumQuantity?: boolean;
  regulatoryQuantity?: boolean;
  spareQuantity?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}
