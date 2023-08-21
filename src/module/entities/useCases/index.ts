import { BilletRepository } from "../repositories/BilletRepository";
import { BillingLocationRepository } from "../repositories/BillingLocationRepository";
import { BrandRepository } from "../repositories/BrandRepository";
import { BrandsToSellerRepository } from "../repositories/BrandsToSellerRepository";
import { ClientRepository } from "../repositories/Client";
import { ClientEmailRepository } from "../repositories/ClientEmailRepository";
import { ClientObsRepository } from "../repositories/ClientObs";
import { CollectionProductRepository } from "../repositories/CollectionProductRepository";
import { ColorRepository } from "../repositories/ColorRepository";
import { ConceptRepository } from "../repositories/ConceptRepository";
import { EanProductRepository } from "../repositories/EanProductRepository";
import { EntityRepository } from "../repositories/EntityRepository";
import { GridProductRepository } from "../repositories/GridProductRepository";
import { GroupProductRepository } from "../repositories/GroupProductRepository";
import { LineProductRepository } from "../repositories/LineProductRepository";
import { LinkClientSellerRepository } from "../repositories/LinkClientSeller";
import { OrderRepository } from "../repositories/OrderRepository";
import { PaymentConditionRepository } from "../repositories/PaymentConditionRepository";
import { PriceListRepository } from "../repositories/PriceListRepository";
import { RegistrationGroupRepository } from "../repositories/RegistrationGroup";
import { SellerRepository } from "../repositories/SellerRepository";
import { SubgroupProductRepository } from "../repositories/SubgroupProductRepository";
import { TablePriceRepository } from "../repositories/TablePriceRepository";

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
export const eanProduct = new EanProductRepository();
export const gridProduct = new GridProductRepository();
export const registrationGroup = new RegistrationGroupRepository();
export const linkClientSeller = new LinkClientSellerRepository();
export const client = new ClientRepository();
export const clientObs = new ClientObsRepository();
export const clientEmail = new ClientEmailRepository();
export const paymentCondition = new PaymentConditionRepository();
export const tablePrice = new TablePriceRepository();
export const billingLocation = new BillingLocationRepository();
export const billet = new BilletRepository();
export const order = new OrderRepository();

export const productImage = new EntityRepository({
  table: "01010s005.DEV_PRODUTO_IMAGEM",
  initial: "i",
});

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
  eanProduct,
  gridProduct,
  registrationGroup,
  linkClientSeller,
  client,
  clientObs,
  clientEmail,
  productImage,
  paymentCondition,
  tablePrice,
  billingLocation,
  billet,
  order,
};
