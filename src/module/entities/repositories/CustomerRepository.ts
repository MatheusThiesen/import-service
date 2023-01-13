import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { Customer } from "../model/Customer";
import { GetListAll } from "../useCases/GetListAll";
import {
  ICustomerRepository,
  QueryCustomerDTO,
} from "./types/ICustomerRepository";

export class CustomerRepository implements ICustomerRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
    page,
    size,
    isPagination,
  }: QueryCustomerDTO) {
    const customers = await this.getListAll.execute<Customer>({
      entity: "customer",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
      page,
      size,
      isPagination,
    });

    return customers;
  }
}
