import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect.js";
// import verifyToken from "../../../../../lib/middleware/verifyToken.js";
import Task from "../../../../../models/Task.js";
import { verifyToken } from "../../../../../lib/middleware/verifyToken.js"; // Import token verification

export async function POST(req) {
  try {
    // 🔹 Verify token
    const tokenData = verifyToken(req);
    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error }), {
        status: tokenData.status,
      });
    }
    const userId = tokenData.userId;

    await dbConnect(); // ✅ Ensure DB connection

    // 🔹 Parse request body
    const { title, description, goalType, targetDate, startDate, dueDate } =
      await req.json();

    // 🔹 Validate fields
    if (
      [title, description, goalType, targetDate, startDate, dueDate].some(
        (field) => !field
      )
    ) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

    // 🔹 Create new task
    const newTask = new Task({
      user: userId,
      title,
      description,
      goalType,
      targetDate,
      startDate,
      dueDate, // 🔥 Make sure dueDate is included
      completed: false,
    });

    await newTask.save();

    return new Response(
      JSON.stringify({ message: "Task created successfully", task: newTask }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return new Response(JSON.stringify({ error: "Failed to create task" }), {
      status: 500,
    });
  }
}
