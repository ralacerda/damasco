import { collection } from "../src/collection";
import { addDoc, getDoc } from "../src/document";
import { damasco } from "../src/index";

console.log("starting damasco");
const db = damasco({ url: "file:local.db" });

console.log("getting the users collection");
const users = collection(db, "users");

console.log("adding a new document to the collection");
const johnId = await addDoc(users, {
  name: "John",
  age: 30,
  lastLogin: new Date(),
  new: true,
});

console.log(johnId);

console.log("getting all documents from the collection");
// const data = await getDocs(users);
const john = await getDoc(users, johnId);

console.log(john);
// console.log(data);
