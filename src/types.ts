import type { Client } from "@libsql/client";
import { type Connector, type Database } from "db0";
export declare const TypeSymbol: unique symbol;
export declare const SchemaSymbol: unique symbol;

export type DamascoDb = {
  connector: Database<Connector<Client>>;
};

export type CollectionSchema = {
  [key: string]: AllowedValue;
};

export type DamascoDocument<T> = T & {
  _uid: string;
};

export type CollectionRef<T> = {
  name: string;
  getDb: () => Promise<DamascoDb>;
  [TypeSymbol]?: T;
};

export type DocRef<T> = {
  collection: CollectionRef<T>;
  uid: string;
};

export type DocumentData<T> = T & {
  _uid: string;
};

export type DocContent = {
  [key: string]: AllowedValue;
};

export type AllowedValue =
  | string
  | boolean
  | number
  | AllowedValue[]
  | { [key: string]: AllowedValue };
