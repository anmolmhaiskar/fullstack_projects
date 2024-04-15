import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/helper/generateTokenAndSetCookie.js";

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select("-password").select("-email");

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({message: "User found successfully!", user})
    } catch (error) {
        console.log("Error getting user profile: ", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const signupUser = async (req, res) => {
    try {
        const {name, email, username, password} = req.body;
        const user = await User.findOne({$or:[{email}, {username}]});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();
        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                message: "User signedUp successfully"
            });
        } else {
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signupUser: ", error.message);
        res.status(500).json({message: error.message});
    }
};

export const loginUser = async (req, res) => {
    try {
        const {username, password } = req.body;
        const user = await User.findOne({ username });
        
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        
        if(!user || !isPasswordCorrect){
            return res.status(400).json({ message: "Invalid username or password" });
        }
        
        generateTokenAndSetCookie(user._id, res);
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        });

    } catch (error) {
        console.log("Error in loginUser: ", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt-token", "", {maxAge: 1});
        res.status(200).json({message: "user logged out successfully!"});
    } catch (error) {
        console.log("Error in logoutUser: ", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req?.user?._id);
        
        if(id === req?.user?._id.toString()){
            return res.status(400).json({message: "You cannot follow/unfollow yourself"});
        }
        
        if(!userToModify || !currentUser){
            return res.status(400).json({message: "User not found"});
        }
        
        const isFollowing = currentUser.following.includes(id);
        
        if(isFollowing){
            await User.findByIdAndUpdate(id, {$pull : { followers: currentUser._id }});
            await User.findByIdAndUpdate(currentUser._id, {$pull : { following: id }});
            res.status(200).json({message: "User unfollowed sucessfully"});
        } else {
            await User.findByIdAndUpdate(id, {$push : {followers: currentUser._id}});
            await User.findByIdAndUpdate(currentUser._id, {$push : {following: id}});
            res.status(200).json({message: "User followed sucessfully"});
        }
    } catch (error) {
        console.log("Error in logoutUser: ", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { name, email, username, password, profileImage, bio } = req.body;
        const userId = req?.user?._id;
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        if(req.params.id !== userId.toString()){
            return res.status(400).json({ message: "You cannot update other user's profile" });
        }

        if(password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hashedPassword(password, salt);
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profileImage = profileImage || user.profileImage;
        user.bio = bio || user.bio;
        user = await user.save();
        res.status(200).json({message: "Profile updated successfully", user});
    } catch (error) {
        console.log("Error in signupUser: ", error.message);
        res.status(500).json({message: error.message});
    }
    
}