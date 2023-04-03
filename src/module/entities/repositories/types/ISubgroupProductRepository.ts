import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import {
  SubgroupProduct,
  SubgroupProductFields,
} from "../../model/SubgroupProduct";

export type QuerySubgroupProductFindAllDTO =
  QueryFindAllEntitySiger<SubgroupProductFields>;
export type QuerySubgroupProductCountDTO = QueryCountEntitySiger;

export interface ISubgroupProductRepository {
  findAll(query: QuerySubgroupProductFindAllDTO): Promise<SubgroupProduct[]>;
  count(query: QuerySubgroupProductCountDTO): Promise<number>;
}
