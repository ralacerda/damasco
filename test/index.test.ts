import { describe, expect, it } from "vitest";
import { damasco } from "../src";
import { parseDocument } from "../src/utils";

function createDamascoOnMemory() {
  return damasco({ url: ":memory:" });
}

describe("collections", () => {
  it("can add documents and read all documents", async () => {
    const db = createDamascoOnMemory();
    const collection = db.collection("myCollection");

    await collection.add({ name: "John", age: 30 });
    const data = await collection.get();

    expect(data).toEqual([{ _uid: expect.any(String), name: "John", age: 30 }]);
  });
});

describe("parser", () => {
  it("correctly parse a JSON with content and _uid", () => {
    const data = {
      _uid: "123",
      content: JSON.stringify({ name: "John", age: 30 }),
    };

    expect(parseDocument(data)).toEqual({ _uid: "123", name: "John", age: 30 });
  });
});
