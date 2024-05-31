import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    conversation: {type: mongoose.Schema.Types.ObjectId, ref: "Conversation"},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    text: String,
    seen: {
        type: Boolean,
        default: false
    },
    img: {
        type: String,
        default: "",
    }
}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);

export default Message;