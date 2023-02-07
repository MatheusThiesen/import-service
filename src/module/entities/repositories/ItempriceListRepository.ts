import { filterFieldsNormalized } from "../../../helpers/filterFieldsNormalized";
import { ItemPriceList } from "../model/ItemPriceList";
import { GetListAll } from "../useCases/GetListAll";
import {
  IItemPriceListRepository,
  QueryItemPriceListDTO,
} from "./types/IItemPriceListRepository";

export class ItemPriceListRepository implements IItemPriceListRepository {
  constructor(private getListAll: GetListAll) {}

  async getAll({
    fields,
    extraFields,
    search,
    page,
    size,
    isPagination,
  }: QueryItemPriceListDTO) {
    const ItensPriceList = await this.getListAll.execute<ItemPriceList>({
      entity: "itempriceList",
      search: search,
      organization: "009",
      fields: filterFieldsNormalized(fields),
      extraFields: filterFieldsNormalized(extraFields),
      page,
      size,
      isPagination,
    });

    return ItensPriceList;
  }
}
