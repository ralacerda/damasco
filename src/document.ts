import type { Database } from "./types";

type DocumentConstructor = {
  _uid: string;
  collection: string;
  getDb: Promise<Database>;
};

export class Document {
  private _uid: string;
  private collection: string;
  getDb: Promise<Database>;

  constructor({ _uid, collection, getDb }: DocumentConstructor) {
    this._uid = _uid;
    this.collection = collection;
    this.getDb = getDb;
  }

  async get() {
    const db = await this.getDb;

    const { rows } =
      await db.sql`SELECT content FROM {${this.collection}} WHERE _uid = ${this._uid}`;

    if (!rows || !rows[0]) {
      throw new Error("Document not found");
    }

    return rows[0].content;
  }
}
