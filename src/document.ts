import { randomUUID } from "uncrypto";
import type { CollectionRef, DocRef, DocumentData } from "./types";
import { parseDocument, stringifyDocument } from "./utils";

export async function addDoc<T>(collection: CollectionRef<T>, content: T) {
  const uid = randomUUID();
  const db = await collection.getDb();
  await db.connector
    .sql`INSERT INTO {${collection.name}} (_uid, content) VALUES (${uid}, ${stringifyDocument(content)})`;
  return uid;
}

export function doc<T>(
  collectionRef: CollectionRef<T>,
  uid: string,
): DocRef<T> {
  return {
    collection: collectionRef,
    uid,
  };
}

export async function deleteDoc<T>(docRef: DocRef<T>) {
  const db = await docRef.collection.getDb();
  const { success } = await db.connector.sql`
    DELETE FROM {${docRef.collection.name}} WHERE _uid = ${docRef.uid}
  `;

  return success;
}

export async function deleteDocs<T>(collectionRef: CollectionRef<T>) {
  const db = await collectionRef.getDb();
  const { success } = await db.connector.sql`
    DELETE FROM {${collectionRef.name}}
  `;

  return success;
}

export async function updateDoc<T>(docRef: DocRef<T>, content: T) {
  const db = await docRef.collection.getDb();

  const { success } = await db.connector.sql`
    UPDATE {${docRef.collection.name}} SET content = ${stringifyDocument(content)} WHERE _uid = ${docRef.uid}
  `;

  return success;
}

export async function getDocs<T>(
  collectionRef: CollectionRef<T>,
): Promise<DocumentData<T>[]> {
  const db = await collectionRef.getDb();
  const { rows } = await db.connector.sql`
    SELECT _uid, content FROM {${collectionRef.name}}
  `;
  if (!rows) {
    return [];
  }

  return rows.map((row) => parseDocument(row));
}

export async function getDoc<T>(
  collectionRef: CollectionRef<T>,
  uid: string,
): Promise<DocumentData<T> | undefined> {
  const db = await collectionRef.getDb();

  const { rows } = await db.connector.sql`
    SELECT _uid, content FROM {${collectionRef.name}} WHERE _uid = ${uid}
  `;

  if (!rows || !rows[0]) {
    return undefined;
  }

  return parseDocument(rows[0]);
}
