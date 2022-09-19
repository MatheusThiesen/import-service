import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { apiSiger } from "../../../service/apiSiger";
import { SigerDTO } from "../../../service/siger";
import { FinancialDocument } from "../model/FinancialDocument";
import {
  IFinancialDocumentRepository,
  QueryFinancialDocumentDTO,
} from "./types/IFinancialDocumentRepository";

export class FinancialDocumentRepository
  implements IFinancialDocumentRepository
{
  async getAll({
    fields,
    extraFields,
    search,
  }: QueryFinancialDocumentDTO): Promise<FinancialDocument[]> {
    const financialDocuments = await apiSiger.get<SigerDTO<FinancialDocument>>(
      "/api/v1/get-list",
      {
        params: {
          entity: "financialDocument",
          search: search,
          fields: filterFieldsNormalized(fields),
          extraFields: filterFieldsNormalized(extraFields),
        },
      }
    );

    return financialDocuments.data.content;
  }
}
