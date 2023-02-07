import { QueryEntitySiger } from "../../../../service/siger";
import {
  ItemPriceList,
  ItemPriceListExtraFields,
  ItemPriceListFields,
} from "../../model/ItemPriceList";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryItemPriceListDTO = QueryEntitySiger<
  ItemPriceListFields,
  ItemPriceListExtraFields
>;

export interface IItemPriceListRepository {
  getAll(
    query: QueryItemPriceListDTO
  ): Promise<GetListAllResponse<ItemPriceList>>;
}
