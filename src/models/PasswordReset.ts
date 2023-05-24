import mongoose from "mongoose";

const PasswordResetSchema: mongoose.Schema = new mongoose.Schema(
    {
      email: {type: String, required: true},
      token: {type: String, required: true},
      role: {type: String, required: true, enum: {
        values: ["student", "tutor"],
        message: "{VALUE} is not supported as a role",
      }},
      allowed: {type: Boolean, required: true, default: false},
      expiresAt: {type: Date, required: true},
    },
    {timestamps: true},
);

const PasswordReset = mongoose.models.PasswordReset ||
      mongoose.model("PasswordReset", PasswordResetSchema);
export default PasswordReset;
