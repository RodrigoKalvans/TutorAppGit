import mongoose from "mongoose";

const StudentSchema: mongoose.Schema = new mongoose.Schema(
    {
      email: {type: String, required: true, unique: true},
      password: {type: String, required: true},
      firstName: {type: String, required: true},
      lastName: {type: String, required: true},
      role: {type: String, required: true, default: "student"},
      picture: {type: String},
      description: {type: String},
      languages: [{
        code: {type: String},
        name: {type: String},
      }],
      followers: [
        {
          userId: {type: String},
          accountType: {type: String},
        },
      ],
      following: [
        {
          userId: {type: String},
          accountType: {type: String},
        },
      ],
      subjects: [{type: String}],
      rating: {
        number: {type: Number, default: 0},
        ratingCount: {type: Number, default: 0},
      },
      reviews: [{reviewId: {type: String}}],
      activity: [{
        activityId: {type: String},
        activityType: {type: String, enum: {
          values: ["comment", "like", "review"],
          message: "{VALUE} is not supported as an activity type!",
        }},
      }],
      posts: [{type: String}],
      isSuspended: {type: Boolean, default: false},
      subscriberId: {type: String},
    },
    {timestamps: true},
);

const Student = mongoose.models.Student ||
      mongoose.model("Student", StudentSchema);
export default Student;
