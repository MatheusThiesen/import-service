import { QueryEntitySiger } from "../../../../service/siger";
import { Color, ColorExtraFields, ColorFields } from "../../model/Color";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryColorDTO = QueryEntitySiger<ColorFields, ColorExtraFields>;

export interface IColorRepository {
  getAll(query: QueryColorDTO): Promise<GetListAllResponse<Color>>;
}
