import express from "express";
import { followUnFollowUser, getUserProfile, loginUser, logoutUser, signupUser, updateUserProfile } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
const router = express.Router();


router.post('/signup', signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.post("/update/:id", protectRoute, updateUserProfile);
router.get("/profile/:username", getUserProfile);

export default router;