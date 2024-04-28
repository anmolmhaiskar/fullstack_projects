import express from "express";
import { createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeUnikePost, replyToPost } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.get("/user/:username", protectRoute, getUserPosts);
router.get("/:id", protectRoute, getPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnikePost);
router.post("/reply/:id", protectRoute, replyToPost);

export default router;