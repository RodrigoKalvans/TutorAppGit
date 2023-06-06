import mongoose from "mongoose";

const TutorSchema: mongoose.Schema = new mongoose.Schema(
    {
      email: {type: String, required: true, unique: true},
      password: {type: String, required: true},
      firstName: {type: String, required: true},
      lastName: {type: String, required: true},
      role: {type: String, required: true, default: "tutor"},
      picture: {type: String},
      description: {type: String},
      languages: [{
        code: {type: String},
        name: {type: String},
      }],
      phoneNumber: {type: String},
      contactEmail: {type: String},
      location: {type: String},
      isOnlineAvailable: {type: Boolean},
      subjects: [{type: String}],
      priceForLessons: {type: Map, of: String},
      followers: [
        {
          userId: {type: String},
          role: {type: String, enum: {
            values: ["student", "tutor"],
            message: "{VALUE} is not supported as an account type!",
          }},
        },
      ],
      following: [
        {
          userId: {type: String},
          role: {type: String, enum: {
            values: ["student", "tutor"],
            message: "{VALUE} is not supported as an account type!",
          }},
        },
      ],
      rating: {
        number: {type: Number, default: 0},
        ratingCount: {type: Number, default: 0},
      },
      reviews: [{type: String}],
      activity: [{
        activityId: {type: String},
        activityType: {type: String, enum: {
          values: ["comment", "like", "review"],
          message: "{VALUE} is not supported as an activity type!",
        }},
      }],
      posts: [{type: String}],
      emailVerified: {type: Boolean, default: false, required: true},
      isSuspended: {type: Boolean, default: false},
      subscriberId: {type: String},
      donations: [{
        amount: {type: Number},
        date: {type: Date},
        paymentId: {type: String},
      }],
    },
    {timestamps: true},
);

const Tutor = mongoose.models.Tutor ||
      mongoose.model("Tutor", TutorSchema);
export default Tutor;
