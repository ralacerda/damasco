import { randomUUID } from "uncrypto";
import type { Database, DocumentData } from "./types";
import { parseDocument } from "./utils";
import { createDocument } from "./document";

type CollectionConstructor = {
  name: string;
  db: Database;
};

export function createCollection({
  name,
  db: initialDb,
}: CollectionConstructor) {
  let db: Database | undefined = undefined;

  async function initializeDb() {
    await initialDb.sql`CREATE TABLE IF NOT EXISTS {${name}} (
      "_uid" TEXT PRIMARY KEY ,
      "content" TEXT
      );`;

    return initialDb;
  }

  async function getDb() {
    if (!db) {
      db = await initializeDb();
    }

    return db;
  }

  async function add<T>(content: T) {
    const uid = randomUUID();
    const db = await getDb();
    await db.sql`INSERT INTO {${name}} (_uid, content) VALUES (${uid}, ${JSON.stringify(content)})`;
    return uid;
  }

  async function get(): Promise<DocumentData[]> {
    const db = await getDb();

    const { rows } = await db.sql`SELECT _uid, content FROM {${name}}`;

    if (!rows) {
      return [];
    }

    return rows.map((row) => parseDocument(row));
  }

  function document(_uid: string) {
    return createDocument({
      _uid,
      collection: name,
      getDb,
    });
  }

  return {
    add,
    get,
    document,
  };
}
