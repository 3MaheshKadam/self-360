import mongoose from "mongoose";

const streakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  activityDates: {
    type: [Date], // All logged activity dates
    default: [],
  },
  lastActionDate: {
    type: Date, // Last recorded action date
    default: null,
  },
  currentStreak: {
    type: Number, // Current ongoing streak
    default: 0,
  },
  highestStreak: {
    type: Number, // Maximum streak achieved
    default: 0,
  },
});

export default mongoose.models.Streak || mongoose.model("Streak", streakSchema);
