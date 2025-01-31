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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual fields for time tracking
goalSchema.virtual("daysSpent").get(function () {
  const currentDate = new Date();
  return Math.max(
    0,
    Math.floor((currentDate - this.createdAt) / (1000 * 60 * 60 * 24))
  ); // Convert milliseconds to days
});

goalSchema.virtual("totalDays").get(function () {
  return Math.max(
    0,
    Math.floor((this.targetDate - this.createdAt) / (1000 * 60 * 60 * 24))
  );
});

goalSchema.virtual("daysRemaining").get(function () {
  const currentDate = new Date();
  return Math.max(
    0,
    Math.floor((this.targetDate - currentDate) / (1000 * 60 * 60 * 24))
  );
});

goalSchema.virtual("timeProgress").get(function () {
  return this.totalDays > 0
    ? Math.min((this.daysSpent / this.totalDays) * 100, 100)
    : 0;
});

// Check if the model already exists to prevent OverwriteModelError
const Goal = mongoose.models.Goal || mongoose.model("Goal", goalSchema);

export default Goal;
