import mongoose from "mongoose";

const FeaturedTutorSchema: mongoose.Schema = new mongoose.Schema(
    {
      tutorId: {type: String, required: true, unique: true},
    },
    {timestamps: true},
);

const FeaturedTutor = mongoose.models.FeaturedTutor ||
      mongoose.model("FeaturedTutor", FeaturedTutorSchema);
export default FeaturedTutor;
