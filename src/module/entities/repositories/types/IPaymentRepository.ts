import { QueryEntitySiger } from "../../../../service/siger";
import {
  Payment,
  PaymentFields,
  PaymentFieldsExtraFields,
} from "../../model/Payment";

export type QueryPaymentDTO = QueryEntitySiger<
  PaymentFields,
  PaymentFieldsExtraFields
>;

export interface IPaymentRepository {
  getAll(query: QueryPaymentDTO): Promise<Payment[]>;
}
