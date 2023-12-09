import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import { adminLogin } from "../controllers/adminController.js";


router.post('/login', adminLogin)

export default router;