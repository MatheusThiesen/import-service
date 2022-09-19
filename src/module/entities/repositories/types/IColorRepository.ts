import { QueryEntitySiger } from "../../../../service/siger";
import { Color, ColorExtraFields, ColorFields } from "../../model/Color";

export type QueryColorDTO = QueryEntitySiger<ColorFields, ColorExtraFields>;

export interface IColorRepository {
  getAll(query: QueryColorDTO): Promise<Color[]>;
}
