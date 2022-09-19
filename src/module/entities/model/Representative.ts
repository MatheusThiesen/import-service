export class Representative {
  code: number;
  description: string;
  abbreviation: string;
  situation: number;
  supervisorRepresentative: {
    code: number;
  };

  inactivationDate: string;
  lastChangeDate: string;
  lastChangeTime: number;
}
export class RepresentativeFields {
  code?: boolean;
  description?: boolean;
  abbreviation?: boolean;
  situation?: boolean;
  supervisorRepresentative?: {
    code?: boolean;
  };

  inactivationDate?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}
export class RepresentativeExtraFields {}
