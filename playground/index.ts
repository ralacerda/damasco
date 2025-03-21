import { damasco, addDoc, collection, getDocs } from "../src/index";

console.log("starting damasco");
const db = damasco({ url: "file:local.db" });

console.log("getting the users collection");
const users = collection(db, "users");

console.log("adding a new document to the collection");
await addDoc(users, {
  name: "John",
  age: 30,
  lastLogin: new Date(),
  new: true,
});

console.log("getting all documents from the collection");
const data = await getDocs(users);

console.log(data);
