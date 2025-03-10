import type { Database } from "./types";
import { parseDocument } from "./utils";

type DocumentConstructor = {
  _uid: string;
  collection: string;
  getDb: () => Promise<Database>;
};

export class Document {
  private _uid: string;
  private collection: string;
  getDb: () => Promise<Database>;

  constructor({ _uid, collection, getDb }: DocumentConstructor) {
    this._uid = _uid;
    this.collection = collection;
    this.getDb = getDb;
  }

  async get() {
    const db = await this.getDb();

    const { rows } =
      await db.sql`SELECT _uid, content FROM {${this.collection}} WHERE _uid = ${this._uid}`;

    if (!rows || !rows[0]) {
      throw new Error("Document not found");
    }

    return parseDocument(rows[0]);
  }

  async set<T>(content: T) {
    const db = await this.getDb();
    await db.sql`UPDATE {${this.collection}} SET content = ${JSON.stringify(content)} WHERE _uid = ${this._uid}`;
  }
}
