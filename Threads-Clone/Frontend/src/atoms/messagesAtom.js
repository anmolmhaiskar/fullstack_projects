import { atom } from "recoil";

export const conversationsAtom = atom({
    key: "conversationAtom",
    default: []
});

export const selectedConversationAtom = atom({
    key: "selectedConversationAtom",
    default: {
        _id: "",
        userId: "",
        username: "",
        userProfilePic: "",
    }
});