import express from "express";
import {
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", protect, updatePassword);
router.post("/logout", logout);

export default router