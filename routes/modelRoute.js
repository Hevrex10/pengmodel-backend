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

router.route("/").get(getAllModel);
router.post(
  "/",
  upload.fields([
    { name: "photos", maxCount: 3 },
    { name: "videos", maxCount: 2 },
  ]),
  createModel,
);

router.route("/:id").get(getModel).patch(protect, updateModel);

export default router;
