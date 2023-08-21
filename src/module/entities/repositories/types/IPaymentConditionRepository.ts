import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import {
  PaymentCondition,
  PaymentConditionFields,
} from "../../model/PaymentCondition";

export type QueryPaymentConditionFindAllDTO =
  QueryFindAllEntitySiger<PaymentConditionFields>;
export type QueryPaymentConditionCountDTO = QueryCountEntitySiger;

export interface IPaymentConditionRepository {
  findAll(query: QueryPaymentConditionFindAllDTO): Promise<PaymentCondition[]>;
  count(query: QueryPaymentConditionCountDTO): Promise<number>;
}
