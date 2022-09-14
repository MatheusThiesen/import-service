import { NumberFilter, StringFilter } from "../types";

export class Representative {
  code: string;
  description: string;
  abbreviation: string;
  situation: number;
  inactivationDate: Date;
  lastChangeDate: Date;
  lastChangeTime: number;
}

export class RepresentativeSelect {
  code?: boolean;
  description?: boolean;
  abbreviation?: boolean;
  situation?: boolean;
  inactivationDate?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}

export class RepresentativeWhere {
  code?: NumberFilter;
  description?: StringFilter;
  abbreviation?: StringFilter;
  situation?: NumberFilter;
  lastChangeTime?: NumberFilter;
}
