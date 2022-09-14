import {
  Representative,
  RepresentativeSelect,
  RepresentativeWhere,
} from "../model/Representative";

export interface GetListArgs {
  select?: RepresentativeSelect;
  where?: RepresentativeWhere;
}

export interface IRepresentativeRepository {
  getList: (query: GetListArgs) => Representative[];
  getOne: () => Representative;
}
