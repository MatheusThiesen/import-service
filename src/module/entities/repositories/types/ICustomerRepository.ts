import { QueryEntitySiger } from "../../../../service/siger";
import {
  Customer,
  CustomerExtraFields,
  CustomerFields,
} from "../../model/Customer";

export type QueryCustomerDTO = QueryEntitySiger<
  CustomerFields,
  CustomerExtraFields
>;

export interface ICustomerRepository {
  getAll(query: QueryCustomerDTO): Promise<Customer[]>;
}
