import mongoose from "mongoose";

const StudentSchema: mongoose.Schema = new mongoose.Schema(
    {
      email: {type: String, required: true, unique: true},
      password: {type: String, required: true},
      firstName: {type: String, required: true},
      secondName: {types: String},
      lastName: {type: String, required: true},
      role: "student",
      picture: {type: Buffer},
      description: {type: String},
      language: [{type: String}],
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
      subjectsStudied: [{type: String}],
      rating: {type: Number},
      reviews: [{reviewId: {type: Number}}],
      activity: [{
        activityId: {type: String},
        activityType: {type: String},
      }],
      posts: [{postId: {type: String}}],
      isSuspended: {type: Boolean, default: false},
    },
);

const Student = mongoose.models.Student ||
      mongoose.model("Student", StudentSchema);
export default Student;
