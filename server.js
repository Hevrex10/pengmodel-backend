import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`PengModel server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err.message);
  });
