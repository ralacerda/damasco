import { damasco } from "../src/index";

console.log("starting damasco");
const db = damasco();

console.log("getting the mycollection collection");
const collection = db.collection("myCollection");

console.log("adding a new document to the collection");
await collection.add({ name: "John", age: 30 });

console.log("getting all documents from the collection");
const data = await collection.get();

console.log(data);
