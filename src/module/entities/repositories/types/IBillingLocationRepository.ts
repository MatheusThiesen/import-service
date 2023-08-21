import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import {
  BillingLocation,
  BillingLocationFields,
} from "../../model/BillingLocation";

export type QueryBillingLocationFindAllDTO =
  QueryFindAllEntitySiger<BillingLocationFields>;
export type QueryBillingLocationCountDTO = QueryCountEntitySiger;

export interface IBillingLocationRepository {
  findAll(query: QueryBillingLocationFindAllDTO): Promise<BillingLocation[]>;
  count(query: QueryBillingLocationCountDTO): Promise<number>;
}
