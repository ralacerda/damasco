import type { createDatabase } from "db0";
import type { CustomTypes } from "./custom-types";

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
  | DamascoCustom<keyof CustomTypes>
  | { [key: string]: AllowedValue; __type: never; __value: never };

export type DamascoCustom<T extends keyof CustomTypes> = {
  __type: T;
  __value: ReturnType<CustomTypes[T]["parse"]>;
  get value(): ReturnType<CustomTypes[T]["parse"]>;
};
