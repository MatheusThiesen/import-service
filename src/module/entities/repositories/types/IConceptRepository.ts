import {
  QueryCountEntitySiger,
  QueryFindAllEntitySiger,
} from "../../../../service/siger";
import { Concept, ConceptFields } from "../../model/Concept";

export type QueryConceptFindAllDTO = QueryFindAllEntitySiger<ConceptFields>;
export type QueryConceptCountDTO = QueryCountEntitySiger;

export interface IConceptRepository {
  findAll(query: QueryConceptFindAllDTO): Promise<Concept[]>;
  count(query: QueryConceptCountDTO): Promise<number>;
}
