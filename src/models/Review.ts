import mongoose from "mongoose";

const ReviewSchema: mongoose.Schema = new mongoose.Schema(
    {
      reviewerUserRole: {type: String, required: true, enum: {
        values: ["student", "tutor"],
        message: "{VALUE} is not supported as a role",
      }},
      reviewerUserId: {type: String, required: true},
      reviewedUserRole: {type: String, required: true, enum: {
        values: ["student", "tutor"],
        message: "{VALUE} is not supported as a role",
      }},
      reviewedUserId: {type: String, required: true},
      rating: {type: Number, min: 0, max: 5},
      text: {type: String},
    },
    {timestamps: true},
);

const Review = mongoose.models.Review ||
      mongoose.model("Review", ReviewSchema);
export default Review;
