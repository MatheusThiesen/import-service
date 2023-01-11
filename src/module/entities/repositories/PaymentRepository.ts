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
  }: QueryPaymentDTO): Promise<Payment[]> {
    const payments = await this.getListAll.execute<Payment>({
      entity: "payment",
      search: search,
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
    });

    return payments;
  }
}
