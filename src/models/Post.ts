import mongoose from "mongoose";

const PostSchema: mongoose.Schema = new mongoose.Schema(
    {
      role: {type: String, required: true, enum: {
        values: ["student", "tutor"],
        message: "{VALUE} is not supported as a role",
      }},
      userId: {type: String, required: true},
      images: [{type: String}],
      description: {type: String},
      likes: [
        {
          likeId: {type: String},
        },
      ],
      comments: [
        {
          commentId: {type: String},
        },
      ],
    },
    {timestamps: true},
);

const Post = mongoose.models.Post ||
      mongoose.model("Post", PostSchema);
export default Post;
