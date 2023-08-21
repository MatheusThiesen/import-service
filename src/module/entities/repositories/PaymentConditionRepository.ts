import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { dbSiger } from "../../../service/dbSiger";
import { PaymentCondition } from "../model/PaymentCondition";
import {
  IPaymentConditionRepository,
  QueryPaymentConditionCountDTO,
  QueryPaymentConditionFindAllDTO,
} from "./types/IPaymentConditionRepository";

export class PaymentConditionRepository implements IPaymentConditionRepository {
  constructor() {}

  whereNormalized(search: string) {
    const whereNormalized = search ? `where ${search}` : ``;
    return whereNormalized;
  }

  async count(query: QueryPaymentConditionCountDTO): Promise<number> {
    const totalItems = Number(
      (
        await dbSiger.$ExecuteQuery<{ total: string }>(
          `
            SELECT count(*) as total FROM 01010s005.dev_vencimentos p         
            ${this.whereNormalized(query.search)};
          `
        )
      )[0].total
    );

    return totalItems;
  }

  async findAll({
    fields,
    search,
    page = 0,
    pagesize = 200,
  }: QueryPaymentConditionFindAllDTO) {
    const limit = pagesize;
    const offset = pagesize * page;

    const PaymentConditions = await dbSiger.$ExecuteQuery<PaymentCondition>(
      `
      select 
        ${filterFieldsNormalized(fields, "p")}
      from 01010s005.dev_vencimentos p        
      ${this.whereNormalized(search)}
      limit ${limit}
      offset ${offset}
      ;
      `
    );

    return PaymentConditions;
  }
}
