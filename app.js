import express from "express";
import cookieParser from "cookie-parser";
import modelRouter from "./routes/modelRoute.js";
import adminRouter from "./routes/adminRoute.js";
import errorController from "./controllers/errorController.js";
import applicationRouter from "./routes/applicationRoutes.js";
import contactRouter from "./routes/contactRoute.js";
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
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/contact", contactRouter);
app.use(errorController);
export default app;
