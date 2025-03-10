import { randomUUID } from "uncrypto";
import type { Database, DocumentData } from "./types";
import { parseDocument } from "./utils";
import { Document } from "./document";

type CollectionConstructor = {
  name: string;
  db: Database;
};

export class Collection {
  private name: string;
  private db: Database;
  private isTableReady: boolean = false;

  constructor({ db, name }: CollectionConstructor) {
    // TODO: Make sure the collection name is a valid SQL identifier
    // otherwise a sql injection could be possible with collection name
    this.name = name;
    this.db = db;
  }

  private async getDb() {
    if (this.isTableReady) {
      return this.db;
    }

    await this.db.sql`CREATE TABLE IF NOT EXISTS {${this.name}} (
      "_uid" TEXT PRIMARY KEY ,
      "content" TEXT
      );`;

    this.isTableReady = true;
    return this.db;
  }

  async add<T>(content: T) {
    const uid = randomUUID();
    const db = await this.getDb();
    await db.sql`INSERT INTO {${this.name}} (_uid, content) VALUES (${uid}, ${JSON.stringify(content)})`;
    return uid;
  }

  document(uid: string) {
    return new Document({
      _uid: uid,
      collection: this.name,
      getDb: this.getDb.bind(this),
    });
  }

  async get(): Promise<DocumentData[]> {
    const db = await this.getDb();

    const { rows } = await db.sql`SELECT _uid, content FROM {${this.name}}`;

    if (!rows) {
      return [];
    }

    return rows.map((row) => parseDocument(row));
  }
}
