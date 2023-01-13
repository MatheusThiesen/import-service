import { QueryEntitySiger } from "../../../../service/siger";
import {
  Payment,
  PaymentFields,
  PaymentFieldsExtraFields,
} from "../../model/Payment";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryPaymentDTO = QueryEntitySiger<
  PaymentFields,
  PaymentFieldsExtraFields
>;

export interface IPaymentRepository {
  getAll(query: QueryPaymentDTO): Promise<GetListAllResponse<Payment>>;
}
