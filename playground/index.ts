import { collection } from "../src/collection";
import { addDoc, getDoc } from "../src/document";
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
