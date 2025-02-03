import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    goalType: {
      type: String,
      enum: ["short-term", "mid-term", "long-term"],
      required: [true, "Goal type is required"],
    },
    targetDate: {
      type: Date,
      required: [true, "Target date is required"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    daysSpent: {
      type: Number,
      default: 0,
    },
    totalDays: {
      type: Number,
      default: 0,
    },
    daysRemaining: {
      type: Number,
      default: 0,
    },
    timeProgress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Goal = mongoose.models.Goal || mongoose.model("Goal", goalSchema);

export default Goal;
