import type { createDatabase } from "db0";

export type Database = ReturnType<typeof createDatabase>;

export type DocumentData = {
  _uid: string;
  [key: string]: any;
};

export type AllowedValue =
  | string
  | boolean
  | number
  | AllowedValue[]
  | { [key: string]: AllowedValue };
