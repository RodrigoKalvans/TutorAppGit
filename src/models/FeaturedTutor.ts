import mongoose from "mongoose";

const FeaturedTutorsSchema: mongoose.Schema = new mongoose.Schema(
    {
      id: {type: String},
    },
    {timestamps: true},
);

const FeaturedTutors = mongoose.models.FeaturedTutors ||
      mongoose.model("FeaturedTutors", FeaturedTutorsSchema);
export default FeaturedTutors;
