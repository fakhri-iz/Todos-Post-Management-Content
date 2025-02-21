import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["creator", "talent"],
    default: "creator",
  },
  contents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      reff: "Content",
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    reff: "User",
  },
});

export default mongoose.model("User", userModel);
