import cloudinary from "cloudinary";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const {recipientId, message} = req.body;
        const senderId = req.user._id;
        let {img} = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all : [senderId, recipientId]}
        });

        if(!conversation){
            conversation = new Conversation({
              participants: [senderId, recipientId],
              lastMessage: {
                sender: senderId,
                text: message,
              },
            });
            conversation.save();
        }

        if(img){
            const uploadPicRes = await cloudinary.uploader.upload(img);
            img = uploadPicRes.secure_url;
        }
        console.log(img);
        const newMessage = new Message({
          conversation: conversation._id,
          sender: senderId,
          text: message,
          img: img || "",
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                participants: [senderId, recipientId],
                lastMessage: {
                    sender: senderId,
                    text: message,
                },
            }),
        ]);

        const recipientSocketId = getRecipientSocketId(recipientId);
        if(recipientSocketId){
            io.to(recipientSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const {otherUserId} = req.params;
        const conversationId = await Conversation.findOne({
            participants: { $all : [userId, otherUserId] }
        });
        if(!conversationId){
            res.status(404).json({error: "Conversation not found"});
        }
        const messages = await Message.find({conversation: conversationId}).sort({createdAt: 1});
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getConversations = async (req, res) =>{
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({
          participants: userId,
        }).populate({
            path: "participants",
            select: "username profilePic",
        });
        
        //filtering current user from the participants list of conversations
        conversations.forEach((conversation) => {
            conversation.participants = conversation.participants.filter((participant) => {
                return participant._id.toString() !== userId.toString();
            });
        });
        
        return res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const markMessagesAsSeen = async (conversationId, userId) => {
    try {
        await Message.updateMany( {conversation: conversationId, seen: false}, { $set : {seen: true}});
        await Conversation.updateOne({_id: conversationId}, {$set : { "lastMessage.seen" : true }});
    } catch (error) {
        console.log("error:", error);
    }
};