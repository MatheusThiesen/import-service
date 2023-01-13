import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { Payment } from "../model/Payment";
import { GetListAll } from "../useCases/GetListAll";
import {
  IPaymentRepository,
  QueryPaymentDTO,
} from "./types/IPaymentRepository";

export class PaymentRepository implements IPaymentRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
    page,
    size,
    isPagination,
  }: QueryPaymentDTO) {
    const payments = await this.getListAll.execute<Payment>({
      entity: "payment",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
      page,
      size,
      isPagination,
    });

    return payments;
  }
}
