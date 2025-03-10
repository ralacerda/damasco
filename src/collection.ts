import { randomUUID } from "uncrypto";
import type { Database, Document } from "./types";
import destr from "destr";

type CollectionConstructor = {
  name: string;
  db: Database;
  isDbReady: Promise<void>;
};

export class Collection {
  private name: string;
  private db: Database;
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
