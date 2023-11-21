import express from "express";
import upload from "../middleware/multer.js";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture
} from "../controllers/userController.js";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protect,getUserProfile).post(protect,updateUserProfile);
router.post("/upload-image",protect,upload.single('image'),updateProfilePicture)

export default router;
