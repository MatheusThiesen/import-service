import { QueryEntitySiger } from "../../../../service/siger";
import { Grid, GridExtraFields, GridFields } from "../../model/Grid";

export type QueryGridDTO = QueryEntitySiger<GridFields, GridExtraFields>;

export interface IGridRepository {
  getAll(query: QueryGridDTO): Promise<Grid[]>;
}
