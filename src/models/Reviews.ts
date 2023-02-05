import mongoose from "mongoose";

const ReviewSchema: mongoose.Schema = new mongoose.Schema(
    {
      role: {type: String, required: true, enum: {
        values: ["student", "tutor"],
        message: "{VALUE} is not supported as a role",
      }},
      reviewerUserId: {type: String, required: true},
      reviewedUserId: {type: String, required: true},
      rating: {type: Number, min: 0, max: 5},
      postId: {type: String, required: true},
      text: {type: String, required: true},
    },
    {timestamps: true},
);

const Review = mongoose.models.Review ||
      mongoose.model("Review", ReviewSchema);
export default Review;
