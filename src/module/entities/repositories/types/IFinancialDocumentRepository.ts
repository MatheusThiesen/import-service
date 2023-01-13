import { QueryEntitySiger } from "../../../../service/siger";
import {
  FinancialDocument,
  FinancialDocumentFields,
  FinancialDocumentFieldsExtraFields,
} from "../../model/FinancialDocument";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryFinancialDocumentDTO = QueryEntitySiger<
  FinancialDocumentFields,
  FinancialDocumentFieldsExtraFields
>;

export interface IFinancialDocumentRepository {
  getAll(
    query: QueryFinancialDocumentDTO
  ): Promise<GetListAllResponse<FinancialDocument>>;
}
