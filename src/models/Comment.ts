import mongoose from "mongoose";

const CommentSchema: mongoose.Schema = new mongoose.Schema(
    {
      role: {type: String, required: true, enum: {
        values: ["student", "tutor"],
        message: "{VALUE} is not supported as a role",
      }},
      userId: {type: String, required: true},
      postId: {type: String, required: true},
      text: {type: String, required: true},
    },
    {timestamps: true},
);

const Comment = mongoose.models.Comment ||
      mongoose.model("Comment", CommentSchema);
export default Comment;
