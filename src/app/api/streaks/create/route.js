import dbConnect from "../../../../../lib/dbConnect.js";
import Streak from "../../../../../models/Streak.js";
import { verifyToken } from "../../../../../lib/middleware/verifyToken.js"; // Import token verification

export async function POST(req) {
  try {
    // 🔹 Verify the token
    const tokenData = verifyToken(req);
    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error }), {
        status: tokenData.status,
      });
    }

    // Extract userId from the verified token
    const userId = tokenData.userId;

    await dbConnect();

    const today = new Date().setHours(0, 0, 0, 0);

    let streak = await Streak.findOne({ user: userId });

    if (!streak) {
      streak = new Streak({
        user: userId,
        activityDates: [today],
        lastActionDate: today,
        currentStreak: 1,
        highestStreak: 1,
      });
    } else {
      // Prevent duplicate entries for the same day
      if (
        streak.activityDates.some((date) => new Date(date).getTime() === today)
      ) {
        return new Response(
          JSON.stringify({ message: "Activity already logged today." }),
          { status: 200 }
        );
      }

      // Calculate streaks
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (new Date(streak.lastActionDate).getTime() === yesterday.getTime()) {
        streak.currentStreak += 1;
      } else {
        streak.currentStreak = 1;
      }

      // Update highest streak
      streak.highestStreak = Math.max(
        streak.highestStreak,
        streak.currentStreak
      );

      // Update streak details
      streak.activityDates.push(today);
      streak.lastActionDate = today;
    }

    await streak.save();

    return new Response(
      JSON.stringify({
        message: "Activity recorded successfully",
        currentStreak: streak.currentStreak,
        highestStreak: streak.highestStreak,
        lastActionDate: streak.lastActionDate,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update streak." }), {
      status: 500,
    });
  }
}
