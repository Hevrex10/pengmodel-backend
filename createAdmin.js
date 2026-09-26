import mongoose from "mongoose";
import Admin from "./models/AdminModel.js";
await mongoose.connect(process.env.DATABASE);

const admin = await Admin.create({
  name: "Adeagbo Emmanuel",
  email: "eadeagbo110@gmail.com",
  password: "test1234",
  passwordConfirm: "test1234",
  role: "admin",
});

await mongoose.connection.close();
