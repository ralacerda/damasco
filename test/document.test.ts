import { describe, expect, it } from "vitest";
import { damasco } from "../src";
import { collection } from "../src/collection";
import {
  addDoc,
  deleteDoc,
  deleteDocs,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "../src/document";

type User = {
  name: string;
  age?: number;
};

function createDamascoOnMemory() {
  return damasco({ url: ":memory:" });
}

describe("collections", () => {
  it("can add documents and read all documents", async () => {
    const db = createDamascoOnMemory();
    const collectionRef = collection<User>(db, "test");

    await addDoc(collectionRef, { name: "John Doe" });
    await addDoc(collectionRef, { name: "Jane Doe" });

    const docs = await getDocs(collectionRef);
    expect(docs).toHaveLength(2);
  });

  it("can get a specific document by id", async () => {
    const db = createDamascoOnMemory();
    const collectionRef = collection<User>(db, "test");

    const id = await addDoc(collectionRef, { name: "John Doe" });
    const document = await getDoc(collectionRef, id);

    expect(document?._uid).toBe(id);
    expect(document).toMatchObject({ name: "John Doe" });
  });

  it("can create document reference and use it", async () => {
    const db = createDamascoOnMemory();
    const collectionRef = collection<User>(db, "test");

    const id = await addDoc(collectionRef, { name: "John Doe" });
    const docRef = doc(collectionRef, id);

    expect(docRef.uid).toBe(id);
    expect(docRef.collection).toBe(collectionRef);
  });

  it("can update a document", async () => {
    const db = createDamascoOnMemory();
    const collectionRef = collection<User>(db, "test");

    const id = await addDoc(collectionRef, { name: "John Doe", age: 30 });
    const docRef = doc(collectionRef, id);

    await updateDoc(docRef, { name: "John Smith", age: 31 });
    const updated = await getDoc(collectionRef, id);

    expect(updated).toMatchObject({ name: "John Smith", age: 31 });
  });

  it("can delete a specific document", async () => {
    const db = createDamascoOnMemory();
    const collectionRef = collection<User>(db, "test");

    const id1 = await addDoc(collectionRef, { name: "John Doe" });
    const id2 = await addDoc(collectionRef, { name: "Jane Doe" });

    const docRef = doc(collectionRef, id1);
    await deleteDoc(docRef);

    const docs = await getDocs(collectionRef);
    expect(docs).toHaveLength(1);
    expect(docs[0]?._uid).toBe(id2);
  });

  it("can delete all documents in a collection", async () => {
    const db = createDamascoOnMemory();
    const collectionRef = collection<User>(db, "test");

    await addDoc(collectionRef, { name: "John Doe" });
    await addDoc(collectionRef, { name: "Jane Doe" });
    await addDoc(collectionRef, { name: "Jim Doe" });

    await deleteDocs(collectionRef);

    const docs = await getDocs(collectionRef);
    expect(docs).toHaveLength(0);
  });
});
