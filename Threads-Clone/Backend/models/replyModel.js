// import mongoose from "mongoose";

// const replySchema = mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//       required: true,
//     },
//     userProfilePic: {
//       type: String,
//     },
//     username: {
//       type: String,
//       required: true,
//     },
//     likes: {
//       type: [mongoose.Schema.Types.ObjectId],
//       ref: "User",
//       default: [],
//     },
//     replyComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
//   },
//   { timestamps: true }
// );

// const Reply = mongoose.model("Reply", replySchema);

// export default Post;