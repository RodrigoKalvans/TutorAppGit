import mongoose from "mongoose";

const LikeSchema: mongoose.Schema = new mongoose.Schema(
    {
      role: {type: String, required: true, enum: {
        values: ["student", "tutor"],
        message: "{VALUE} is not supported as a role",
      }},
      userId: {type: String, required: true},
      postId: {type: String, required: true},
    },
    {timestamps: true},
);

const Like = mongoose.models.Like ||
      mongoose.model("Like", LikeSchema);
export default Like;
