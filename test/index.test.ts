import { describe, expect, it } from "vitest";
import { damasco } from "../src";

function createDamascoOnMemory() {
  return damasco({ url: ":memory:" });
}

describe("damasco", () => {
  it("creates a collection and writes to it", async () => {
    const db = createDamascoOnMemory();
    const collection = db.collection("myCollection");

    await collection.add({ name: "John", age: 30 });
    const data = await collection.get();

    expect(data).toEqual([{ _uid: expect.any(String), name: "John", age: 30 }]);
  });
});
