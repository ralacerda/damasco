import { collection } from "../src/collection";
import { addDoc, doc, getDoc, updateDoc } from "../src/document";
import { damasco } from "../src/index";

type User = {
  name: string;
  age: number;
  new: boolean;
  lastSeen?: Date;
};

console.log("starting damasco");
const db = damasco({ url: "file:local.db" });

console.log("gettingthe users collection");
const users = collection(db, "users");

console.log("adding a new document to the collection");
const johnId = await addDoc<User>(users, {
  name: "John",
  age: 30,
  new: true,
  lastSeen: new Date(),
});

console.log(johnId);

const john = await getDoc<User>(users, johnId);

console.log(john);
// console.log(data);

if (!john) {
  console.log("no john");
  throw new Error("no john");
}

updateDoc<User>(doc(users, johnId), {
  ...john,
  name: "John Doe",
});

const john2 = await getDoc<User>(users, johnId);
console.log(john2);
