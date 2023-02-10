import mongoose from "mongoose";

const SubjectSchema: mongoose.Schema = new mongoose.Schema(
    {
      name: {type: String, required: true},
      tutors: [{type: String, required: true}],
      icon: {type: Buffer},
    },
    {timestamps: true},
);

const Subject = mongoose.models.Subject ||
      mongoose.model("Subject", SubjectSchema);
export default Subject;
