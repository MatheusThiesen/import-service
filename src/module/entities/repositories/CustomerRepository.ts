import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { Customer } from "../model/Customer";
import {
  ICustomerRepository,
  QueryCustomerDTO,
} from "./types/ICustomerRepository";

export class CustomerRepository implements ICustomerRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryCustomerDTO): Promise<Customer[]> {
    const customers = await apiSiger.get<SigerDTO<Customer>>(
      "/api/v1/get-list",
      {
        params: {
          entity: "customer",
          search: search,
          fields: filterFieldsNormalized(fields),
          extraFields: filterFieldsNormalized(extraFields),
        },
      }
    );

    return customers.data.content;
  }
}
