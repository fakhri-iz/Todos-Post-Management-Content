import mongoose from "mongoose";

const transactionModel = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      reff: "User",
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionModel);
