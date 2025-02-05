import dbConnect from "../../../../../lib/dbConnect.js";
import Goal from "../../../../../models/Goals.js";
import { verifyToken } from "../../../../../lib/middleware/verifyToken.js";

export async function POST(req) {
  try {
    const tokenData = verifyToken(req);
    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error }), {
        status: tokenData.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = tokenData.userId;

    const body = await req.json();
    const { title, description, goalType, targetDate } = body;

    if (!title || !description || !goalType || !targetDate) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await dbConnect();

    const newGoal = new Goal({
      user: userId,
      title,
      description,
      goalType,
      targetDate,
    });

    const savedGoal = await newGoal.save();

    return new Response(JSON.stringify(savedGoal), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating goal:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create the goal." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
