import mongoose from "mongoose";

/**
 * User model used by MongoDB
 * Property with unique and required set to true is primary key
 * At the same time MongoDB creates id for each entity
 */
const UserSchema: mongoose.Schema = new mongoose.Schema(
    {
      email: {type: String, required: true, unique: true},
      password: {type: String, required: true},
      firstName: {type: String},
      lastName: {type: String},
      role: {type: String},
    },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
