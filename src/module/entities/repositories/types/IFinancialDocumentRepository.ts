import { QueryEntitySiger } from "../../../../service/siger";
import {
  FinancialDocument,
  FinancialDocumentFields,
  FinancialDocumentFieldsExtraFields,
} from "../../model/FinancialDocument";

export type QueryFinancialDocumentDTO = QueryEntitySiger<
  FinancialDocumentFields,
  FinancialDocumentFieldsExtraFields
>;

export interface IFinancialDocumentRepository {
  getAll(query: QueryFinancialDocumentDTO): Promise<FinancialDocument[]>;
}
