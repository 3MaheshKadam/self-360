import dbConnect from "../../../../lib/dbConnect.js";
import Goal from "../../../../models/Goals.js";
import jwt from "jsonwebtoken";

// send token in the request url itself
// export async function POST(req) {
//   try {
//     // Parse the request body
//     const body = await req.json();
//     const { user, title, description, goalType, targetDate, token } = body;

//     // Validate the required fields
//     if (!user || !title || !description || !goalType || !targetDate || !token) {
//       return new Response(
//         JSON.stringify({
//           error: "All fields are required, including a valid token.",
//         }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // Verify the JWT token (if authentication is required)
//     try {
//       jwt.verify(token, process.env.JWT_SECRET); // Replace `process.env.JWT_SECRET` with your secret key
//     } catch (err) {
//       return new Response(
//         JSON.stringify({ error: "Invalid or expired token." }),
//         { status: 401, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // Connect to the database
//     await dbConnect();

//     // Create a new goal
//     const newGoal = new Goal({
//       user,
//       title,
//       description,
//       goalType,
//       targetDate,
//     });

//     const savedGoal = await newGoal.save();

//     // Respond with the saved goal
//     return new Response(JSON.stringify(savedGoal), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error saving goal:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to create the goal." }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { title, description, goalType, targetDate } = body;

    // Validate the required fields
    if (!title || !description || !goalType || !targetDate) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract the token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authorization token is missing or invalid." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get user ID from the decoded token
    const userId = decodedToken.userId;

    // Connect to the database
    await dbConnect();

    // Create a new goal
    const newGoal = new Goal({
      user: userId, // Use the user ID from the token
      title,
      description,
      goalType,
      targetDate,
    });

    const savedGoal = await newGoal.save();

    // Respond with the saved goal
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
