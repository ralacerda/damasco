import type { CollectionRef, DamascoDb, AllowedValue } from "./types";

export function collection<T extends Record<string, AllowedValue>>(
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
