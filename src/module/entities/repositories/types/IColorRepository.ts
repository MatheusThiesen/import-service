import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { Color, ColorFields } from "../../model/Color";

export type QueryColorFindAllDTO = QueryFindAllEntitySiger<ColorFields>;
export type QueryColorCountDTO = QueryCountEntitySiger;

export interface IColorRepository {
  findAll(query: QueryColorFindAllDTO): Promise<Color[]>;
  count(query: QueryColorCountDTO): Promise<number>;
}
