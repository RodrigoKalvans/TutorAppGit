import mongoose from "mongoose";

const AdminSchema: mongoose.Schema = new mongoose.Schema(
    {
      role: {type: String, required: true, default: "admin"},
      email: {type: String, required: true, unique: true},
      password: {type: String, required: true},
      firstName: {type: String, required: true},
      lastName: {type: String, required: true},
    },
    {timestamps: true},
);

const Admin = mongoose.models.Admin ||
      mongoose.model("Admin", AdminSchema);
export default Admin;
