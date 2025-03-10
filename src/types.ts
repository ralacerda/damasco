import type { createDatabase } from "db0";

export type Database = ReturnType<typeof createDatabase>;

export type Document<T> = {
  _uid: string;
  content: T;
};
