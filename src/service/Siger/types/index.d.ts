export type NumberFilter = {
  equals?: number;
  not?: number;
  lt?: number;
  gt?: number;
  btw?: [number, number];
  in?: Enumerable<number>;
};
export type StringFilter = {
  equals?: string;
  not?: string;
  lt?: string;
  gt?: string;
  in?: Enumerable<string>;
  contains?: string;
  like?: string;
};
