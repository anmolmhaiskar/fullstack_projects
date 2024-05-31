import express from "express";
import { followUnFollowUser, getSuggestedUsers, getUserProfile, loginUser, logoutUser, signupUser, updateUserProfile } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
const router = express.Router();


router.get("/profile/:query", getUserProfile);
router.post('/signup', signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", protectRoute, updateUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);

export default router;