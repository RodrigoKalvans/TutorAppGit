import mongoose from "mongoose";

const SubjectSchema: mongoose.Schema = new mongoose.Schema(
    {
      name: {type: String, required: true, unique: true},
      tutors: [{type: String}],
    },
    {timestamps: true},
);

const Subject = mongoose.models.Subject ||
      mongoose.model("Subject", SubjectSchema);
export default Subject;
