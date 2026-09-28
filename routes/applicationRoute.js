import express from "express";

import {
  getAllApplication,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

import { protect } from "../controllers/authController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.array("photos", 3), createApplication);
router.get("/", protect, getAllApplication);
router
  .route("/:id")
  .get(protect, getApplication)
  .patch(protect, updateApplication)
  .delete(protect, deleteApplication);

export default router;
                                                                                                                                                                                                                                                                                          