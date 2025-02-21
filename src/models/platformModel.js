import mongoose from "mongoose";

const platformModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
      },
    ],
  },
  {
    timestamp: true,
  }
);

export default mongoose.model("Platform", platformModel);
