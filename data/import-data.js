import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Model from "../models/modelModel.js";
const _fileName = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_fileName);

dotenv.config({ path: "./config.env" });

const models = JSON.parse(
  fs.readFileSync(path.join(_dirname, "model.json"), "utf-8"),
);

async function importData() {
  try {
    await Model.create(models);

    console.log("Models successfully loaded");
  } catch (err) {
    console.log(err);
  }

  process.exit();
}

async function deleteData() {
  try {
    await Model.deleteMany();

    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }

  process.exit();
}

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB connected");

    if (process.argv.includes("--import")) {
      importData();
    }

    if (process.argv.includes("--delete")) {
      deleteData();
    }
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
