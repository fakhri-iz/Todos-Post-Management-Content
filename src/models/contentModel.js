import mongoose from "mongoose";
import platformModel from "./platformModel.js";
import contentDetailModel from "./contentDetailModel.js";
import userModel from "./userModel.js";

const contentModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Platform",
  },
  tagline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  talents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  details: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentDetail",
    },
  ],
});

contentModel.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await platformModel.findByIdAndUpdate(doc.platform, {
      $pull: {
        contents: doc._id,
      },
    });

    await contentDetailModel.deleteMany({
      contents: doc._id,
    });

    doc.talents?.map(async (tln) => {
      await userModel.findByIdAndUpdate(tln._id, {
        $pull: {
          contents: doc._id,
        },
      });
    });
  }
});

export default mongoose.model("Content", contentModel);
