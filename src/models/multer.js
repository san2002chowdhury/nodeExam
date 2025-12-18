import mongoose from "mongoose";

const multerSchema = new mongoose.Schema(
  {
    picture: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("picture", multerSchema);
