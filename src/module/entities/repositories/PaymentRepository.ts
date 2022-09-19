import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { Payment } from "../model/Payment";
import {
  IPaymentRepository,
  QueryPaymentDTO,
} from "./types/IPaymentRepository";

export class PaymentRepository implements IPaymentRepository {
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryPaymentDTO): Promise<Payment[]> {
    const payments = await apiSiger.get<SigerDTO<Payment>>("/api/v1/get-list", {
      params: {
        entity: "payment",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
      },
    });

    return payments.data.content;
  }
}
