import { randomUUID } from "node:crypto";
import type { CollectionRef, DocContent, DocRef } from "./types";
import { parseDocument } from "./utils";

export async function addDoc(collection: CollectionRef, content: object) {
  const uid = randomUUID();
  const db = await collection.getDb();
  await db.connector
    .sql`INSERT INTO {${collection.name}} (_uid, content) VALUES (${uid}, ${JSON.stringify(content)})`;
  return uid;
}

export function doc(collectionRef: CollectionRef, uid: string): DocRef {
  return {
    collection: collectionRef,
    uid,
  };
}

export async function deleteDoc(docRef: DocRef) {
  const db = await docRef.collection.getDb();
  const { success } = await db.connector.sql`
    DELETE FROM {${docRef.collection.name}} WHERE _uid = ${docRef.uid}
  `;

  return success;
}

export async function deleteDocs(collectionRef: CollectionRef) {
  const db = await collectionRef.getDb();
  const { success } = await db.connector.sql`
    DELETE FROM {${collectionRef.name}}
  `;

  return success;
}

export async function updateDoc(docRef: DocRef, content: DocContent) {
  const db = await docRef.collection.getDb();

  const { success } = await db.connector.sql`
    UPDATE {${docRef.collection.name}} SET content = ${JSON.stringify(content)} WHERE _uid = ${docRef.uid}
  `;

  return success;
}

export async function getDocs(collectionRef: CollectionRef) {
  const db = await collectionRef.getDb();
  const { rows } = await db.connector.sql`
    SELECT _uid, content FROM {${collectionRef.name}}
  `;
  if (!rows) {
    return [];
  }

  return rows.map((row) => parseDocument(row));
}

export async function getDoc(collectionRef: CollectionRef, uid: string) {
  const db = await collectionRef.getDb();

  const { rows } = await db.connector.sql`
    SELECT _uid, content FROM {${collectionRef.name}} WHERE _uid = ${uid}
  `;

  if (!rows || !rows[0]) {
    return undefined;
  }

  return parseDocument(rows[0]);
}
