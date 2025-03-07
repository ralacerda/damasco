import { createDatabase } from "db0";
import libSql from "db0/connectors/libsql/node";
import { destr } from "destr";
import { randomUUID } from "uncrypto";

const db = createDatabase(libSql({ url: `file:local.db`, intMode: "string" }));

// Create users table
await db.sql`CREATE TABLE IF NOT EXISTS users (
    "_uid" TEXT PRIMARY KEY ,
    "content" TEXT
  );`;

type Meta = {
  age: number;
};

const meta: Meta = {
  age: 30,
};

// await db.sql`INSERT INTO users VALUES ('John', 'Doe', ${JSON.stringify(meta)})`;

console.log(await collectionAdd(meta));

console.log(await collectionGet());

async function collectionAdd<T>(content: T) {
  const uid = randomUUID();
  await db.sql`INSERT INTO users (_uid, content) VALUES (${uid}, ${JSON.stringify(content)})`;
  return uid;
}

async function docGet<T>(uid: string): Promise<T | null> {
  const { rows } = await db.sql`SELECT content FROM users WHERE _uid = ${uid}`;

  if (!rows || !rows.length || !rows[0]?.content) {
    return null;
  }

  return destr(rows[0].content);
}

async function collectionGet<T>(): Promise<Document<T>[]> {
  const { rows } = await db.sql`SELECT _uid, content FROM users`;

  if (!rows) {
    return [];
  }

  return rows.map((row) => {
    return {
      _uid: row._uid as string,
      content: destr(row.content),
    };
  });
}

type Document<T> = {
  _uid: string;
  content: T;
};
