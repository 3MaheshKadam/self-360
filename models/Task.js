import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalType: { type: String, required: true },
  targetDate: { type: Date, required: true },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

// ✅ Ensure the model is registered only once
const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export default Task;
