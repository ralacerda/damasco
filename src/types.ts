import type { Client } from "@libsql/client";
import { type Connector, type Database } from "db0";

export type DamascoDb = {
  connector: Database<Connector<Client>>;
};

export type CollectionRef = {
  name: string;
  getDb: () => Promise<DamascoDb>;
};

export type DocRef = {
  collection: CollectionRef;
  uid: string;
};

export type DocumentData = {
  _uid: string;
  [key: string]: any;
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
