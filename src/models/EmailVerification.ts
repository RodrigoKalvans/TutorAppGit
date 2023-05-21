import mongoose from "mongoose";

const EmailVerificationSchema: mongoose.Schema = new mongoose.Schema(
    {
      email: {type: String, required: true},
      token: {type: String, required: true},
      role: {type: String, required: true, enum: {
        values: ["student", "tutor"],
        message: "{VALUE} is not supported as a role",
      }},
    },
    {timestamps: true},
);

const EmailVerification = mongoose.models.EmailVerification ||
      mongoose.model("EmailVerification", EmailVerificationSchema);
export default EmailVerification;
