import { BrandRepository } from "../repositories/BrandRepository";
import { BrandsToSellerRepository } from "../repositories/BrandsToSellerRepository";
import { CollectionProductRepository } from "../repositories/CollectionProductRepository";
import { ColorRepository } from "../repositories/ColorRepository";
import { ConceptRepository } from "../repositories/ConceptRepository";
import { GroupProductRepository } from "../repositories/GroupProductRepository";
import { LineProductRepository } from "../repositories/LineProductRepository";
import { PriceListRepository } from "../repositories/PriceListRepository";
import { SellerRepository } from "../repositories/SellerRepository";
import { SubgroupProductRepository } from "../repositories/SubgroupProductRepository";

export const brand = new BrandRepository();
export const collectionProduct = new CollectionProductRepository();
export const color = new ColorRepository();
export const groupProduct = new GroupProductRepository();
export const lineProduct = new LineProductRepository();
export const priceList = new PriceListRepository();
export const subgroupProduct = new SubgroupProductRepository();
export const concept = new ConceptRepository();
export const seller = new SellerRepository();
export const brandsToSeller = new BrandsToSellerRepository();

export const entities = {
  brand,
  collectionProduct,
  color,
  groupProduct,
  lineProduct,
  priceList,
  subgroupProduct,
  concept,
  seller,
  brandsToSeller,
};
