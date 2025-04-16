import type { CollectionRef, DamascoDb } from "./types";

export function collection<T = any>(
  db: DamascoDb,
  collectionName: string,
): CollectionRef<T> {
  let isTableReady = false;

  async function getDb() {
    if (isTableReady) {
      return db;
    }

    await db.connector.sql`CREATE TABLE IF NOT EXISTS {${collectionName}} (
      "_uid" TEXT PRIMARY KEY ,
      "_createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
      "_updatedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
      "content" TEXT
      );`;

    isTableReady = true;
    return db;
  }

  return {
    name: collectionName,
    getDb,
  };
}
