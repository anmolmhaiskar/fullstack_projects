import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const getPost = async (req, res) => {
    try {
        console.log(req.params.id);
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        res.status(200).json({post});
    } catch (error) {
        console.log("Failed to get post: ", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    try {
        const { postedBy, text, img } = req.body;
        const user = await User.findById(postedBy);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(user._id.toString() !== req?.user?._id.toString()){
            return res.status(400).json({message: "Unauthorized to create post"});
        }

        const maxTextLen = 500;
        if(text.length > maxTextLen){
            return res.status(400).json({message: `Text must be less that ${maxTextLen} characters`});
        }

        const newPost = new Post({postedBy, text, img});
        await newPost.save();

        res.status(201).json({post: newPost});
    } catch (error) {
        console.log("Error creating post: ", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params?.id);

        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(400).json({message: "Unauthorized to delete the post"});
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(204).json({message: "Post deleted successfully"});
    } catch (error) {
        console.log("Failed to get post: ", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const likeUnikePost = async (req, res) => {
    try {
        const {id:postId} = req.params;
        const post = await Post.findById(postId);
        const userId = req.user?._id;
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
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
        res.status(500).json({ message: error.message });
    }
}
