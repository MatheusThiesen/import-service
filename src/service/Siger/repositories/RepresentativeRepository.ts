import { Representative } from "../model/Representative";
import {
  GetListArgs,
  IRepresentativeRepository,
} from "./IRepresentativeRepository";

export class RepresentativeRepository implements IRepresentativeRepository {
  getList: (query: GetListArgs) => Representative[];
  getOne: () => Representative;
}
