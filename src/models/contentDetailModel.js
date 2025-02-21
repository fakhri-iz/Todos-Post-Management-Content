import mongoose from "mongoose";
import contentModel from "./contentModel.js";

const contentDetailModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["video", "text"],
      default: "video",
    },
    videoId: String,
    text: String,
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
    },
  },
  { timestamp: true }
);

contentDetailModel.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await contentModel.findByIdAndUpdate(doc.content, {
      $pull: {
        details: doc._id,
      },
    });
  }
});

export default mongoose.model("ContentDetail", contentDetailModel);
