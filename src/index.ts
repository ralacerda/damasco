import { createDatabase } from "db0";
import libSql from "db0/connectors/libsql/node";
import { destr } from "destr";
import { randomUUID } from "uncrypto";
import { defu } from "defu";

type CollectionConstructor = {
  name: string;
  db: ReturnType<typeof createDatabase>;
  isDbReady: Promise<void>;
};

class Collection {
  private name: string;
  private db: ReturnType<typeof createDatabase>;
  private isTableReady: Promise<unknown>;

  constructor({ db, isDbReady, name }: CollectionConstructor) {
    // TODO: Make sure the collection name is a valid SQL identifier
    // otherwise a sql injection could be possible with collection name
    this.name = name;
    this.db = db;

    this.isTableReady = this.init(isDbReady);
  }

  private async init(isDbReady: Promise<void>) {
    await isDbReady;
    return this.db.sql`CREATE TABLE IF NOT EXISTS {${this.name}} (
      "_uid" TEXT PRIMARY KEY ,
      "content" TEXT
    );`;
  }

  private async getDb() {
    await this.isTableReady;
    return this.db;
  }

  async add<T>(content: T) {
    const uid = randomUUID();
    const db = await this.getDb();
    await db.sql`INSERT INTO {${this.name}} (_uid, content) VALUES (${uid}, ${JSON.stringify(content)})`;
    return uid;
  }

  async get<T>(): Promise<Document<T>[]> {
    const db = await this.getDb();

    const { rows } = await db.sql`SELECT _uid, content FROM {${this.name}}`;

    if (!rows) {
      return [];
    }

    return rows.map((row) => {
      return {
        // @ts-expect-error _uid is not in content
        _uid: row._uid as string,
        ...destr(row.content),
      };
    });
  }
}

type DamascoOptions = {
  url?: string;
};

const defaultOptions = {
  url: "file:local.db",
};

export function damasco(options?: DamascoOptions) {
  const { url } = defu(options, defaultOptions);

  const db = createDatabase(libSql({ url, intMode: "string" }));

  const isDbReady = new Promise<void>((resolver) => resolver());

  return {
    collection(name: string) {
      return new Collection({ name, db, isDbReady });
    },
  };
}

type Document<T> = {
  _uid: string;
  content: T;
};
