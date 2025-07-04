
import express from "express";
import {
  signup,
  login,
  checkAuth,
  updateProfile,
  logout,
  getAllUsers,
} from "../controlers/user.controler.js";
import { protectRoute } from "../middleware/auth.js";
import { handlefileUpload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', protectRoute, checkAuth);
router.put('/update-profile', protectRoute, handlefileUpload("file"), updateProfile);
router.get('/users', protectRoute, getAllUsers);

export default router;