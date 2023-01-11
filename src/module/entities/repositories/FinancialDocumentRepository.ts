import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { FinancialDocument } from "../model/FinancialDocument";
import { GetListAll } from "../useCases/GetListAll";
import {
  IFinancialDocumentRepository,
  QueryFinancialDocumentDTO,
} from "./types/IFinancialDocumentRepository";

export class FinancialDocumentRepository
  implements IFinancialDocumentRepository
{
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
  }: QueryFinancialDocumentDTO): Promise<FinancialDocument[]> {
    const financialDocuments = await this.getListAll.execute<FinancialDocument>(
      {
        entity: "financialDocument",
        search: search,
        fields: filterFieldsNormalized(fields),
        extraFields: filterFieldsNormalized(extraFields),
      }
    );

    return financialDocuments;
  }
}
