export class Grid {
  code: number;
  description: string;
  abbreviation: string;
  active: number;
  size: number;
  lastChangeDate: string;
  lastChangeTime: number;
}
export class GridFields {
  code?: boolean;
  description?: boolean;
  abbreviation?: boolean;
  active?: boolean;
  size?: boolean;
  lastChangeDate?: boolean;
  lastChangeTime?: boolean;
}
export class GridExtraFields {}
