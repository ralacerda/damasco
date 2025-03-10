import type { createDatabase } from "db0";

export type Database = ReturnType<typeof createDatabase>;

export type DocumentData<T> = {
  _uid: string;
  [key: string]: any;
};
