import type { Database } from "./types";
import { parseDocument } from "./utils";

type DocumentConstructor = {
  _uid: string;
  collection: string;
  getDb: () => Promise<Database>;
};

export function createDocument({
  _uid,
  collection,
  getDb,
}: DocumentConstructor) {
  async function get() {
    const db = await getDb();

    const { rows } =
      await db.sql`SELECT _uid, content FROM {${collection}} WHERE _uid = ${_uid}`;

    if (!rows || !rows[0]) {
      throw new Error("Document not found");
    }

    return parseDocument(rows[0]);
  }

  async function set<T>(content: T) {
    const db = await getDb();
    const result = await db.sql`
      INSERT INTO {${collection}} (_uid, content) 
      VALUES (${_uid}, ${JSON.stringify(content)})
      ON CONFLICT (_uid) 
      DO UPDATE SET content = ${JSON.stringify(content)}
    `;

    return result;
  }

  return {
    get,
    set,
  };
}
