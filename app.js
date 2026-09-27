import express from "express";
import cookieParser from "cookie-parser";
import modelRouter from "./routes/modelRoute.js";
import adminRoute from "./routes/adminRoute.js";
import errorController from "./controllers/errorController.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://pengmodel.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/models", modelRouter);
app.use("/api/v1/admin", adminRoute);
app.use(errorController);
export default app;
