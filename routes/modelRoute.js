import express from "express";
import {
  getAllModel,
  createModel,
  getModel,
  updateModel,
} from "../controllers/modelController.js";
import { protect, restrictTo } from "../controllers/authController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .get(getAllModel)
  .post(protect, upload.single("file"), createModel);

router.route("/:id").get(getModel).patch(protect, updateModel);

export default router;
