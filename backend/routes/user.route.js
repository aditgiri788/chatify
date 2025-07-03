
import express from "express";
import {
  signup,
  login,
  checkAuth,
  updateProfile,
} from "../controlers/user.controler.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/check-auth', checkAuth);
router.put('/update-profile', updateProfile);

export default router;