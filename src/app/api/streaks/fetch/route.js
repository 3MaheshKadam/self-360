import dbConnect from "../../../../../lib/dbConnect.js";
import Streak from "../../../../../models/Streak.js";
import { verifyToken } from "../../../../../lib/middleware/verifyToken.js";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    // Verify the user token
    const decoded = await verifyToken(req);
    const userId = decoded?.userId; // Extract userId from the decoded token object

    console.log("Decoded userId: ", userId); // Log the userId

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ensure userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(JSON.stringify({ error: "Invalid User ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Connect to the database
    await dbConnect();

    // Fetch the user's streak (Convert userId to ObjectId)
    const streak = await Streak.findOne({
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!streak) {
      return new Response(
        JSON.stringify({ message: "No streak found for this user" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the user's streak
    return new Response(JSON.stringify(streak), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching streak:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch streak" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
