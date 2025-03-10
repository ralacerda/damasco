import { createDatabase } from "db0";
import libSql from "db0/connectors/libsql/node";
import { Collection } from "./collection";

type DamascoOptions = {
  url: string;
};

export function damasco(options: DamascoOptions) {
  const db = createDatabase(libSql({ url: options.url, intMode: "string" }));

  return {
    collection(name: string) {
      return new Collection({ name, db });
    },
  };
}
