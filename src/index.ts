import libSql from "db0/connectors/libsql/node";
import type { DamascoDb } from "./types";
import { createDatabase } from "db0";

type DamascoOptions = {
  url: string;
};

export function damasco(options: DamascoOptions): DamascoDb {
  const db = createDatabase(libSql({ url: options.url, intMode: "string" }));

  return {
    connector: db,
  };
}
