import cloudinary from "cloudinary";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        res.status(200).json(post);
    } catch (error) {
        console.log("Failed to get post: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({error: "User not found"});
        }
        
        const following = user.following.filter(follows => follows.length>0);
        console.log(following);
        
        const feedPosts = await Post.find({postedBy: {$in : following}}).sort({createdAt: -1});
        
        res.status(200).json(feedPosts);
        
    } catch (error) {
        console.log("Failed to get post: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body;
        let { img } = req.body;
        const user = await User.findById(postedBy);

        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        if(user._id.toString() !== req?.user?._id.toString()){
            return res.status(400).json({error: "Unauthorized to create post"});
        }

        const maxTextLen = 500;
        if(text.length > maxTextLen){
            return res.status(400).json({error: `Text must be less that ${maxTextLen} characters`});
        }

        if (img) {
            const uploadPicRes = await cloudinary.uploader.upload(img);
            img = uploadPicRes.secure_url;
        }

        const newPost = new Post({postedBy, text, img});
        await newPost.save();

        res.status(201).json({post: newPost});
    } catch (error) {
        console.log("Error creating post: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params?.id);

        if(!post){
            return res.status(404).json({ error: "Post not found" });
        }
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(400).json({error: "Unauthorized to delete the post"});
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        
        // res.status(200).json({message: "Post deleted successfully"});
        res.status(204).end();
    } catch (error) {
        console.log("Failed to get post: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const likeUnikePost = async (req, res) => {
    try {
        const {id:postId} = req.params;
        const post = await Post.findById(postId);
        const userId = req.user?._id;
        if (!post) {
          return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            res.status(200).json({message: "Post unliked successfully"});
        }else {
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message: "Post liked successfully"});
        }
    } catch (error) {
        console.log("Failed to get post: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        const posts = await Post.find({postedBy: user._id}).sort({createdAt: -1});
        if (!posts) {
          return res.status(404).json({ error: "User Posts not found" });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log("Failed to get user post: ", error.message);
        res.status(500).json({ error: error.message });
    }
} 

export const replyToPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if(!text){
            return res.status(400).json({ error: "Text field is required" });
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ error: "Post not found" });
        }

        const reply = { userId, text, userProfilePic, username };
        
        post.replies.push(reply);
        await post.save();

        res.status(201).json({message: "Reply added successfully", post});
    } catch (error) {
        console.log("Failed to get post: ", error.message);
        res.status(500).json({ error: error.message });
    }
}
