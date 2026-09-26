import express from "express";
import cookieParser from "cookie-parser";
import modelRouter from "./routes/modelRoute.js";
import adminRoute from "./routes/adminRoute.js";
import errorController from "./controllers/errorController.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/models", modelRouter);
app.use("/api/v1/admin", adminRoute);
app.use(errorController);
export default app;
