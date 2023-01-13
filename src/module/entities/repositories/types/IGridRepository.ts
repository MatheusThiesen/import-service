import { QueryEntitySiger } from "../../../../service/siger";
import { Grid, GridExtraFields, GridFields } from "../../model/Grid";
import { GetListAllResponse } from "../../useCases/GetListAll";

export type QueryGridDTO = QueryEntitySiger<GridFields, GridExtraFields>;

export interface IGridRepository {
  getAll(query: QueryGridDTO): Promise<GetListAllResponse<Grid>>;
}
