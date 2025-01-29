import bcrypt from "bcryptjs";
import User from "../../../../models/User.js"; // Adjusted path
import dbConnect from "../../../../lib/dbConnect.js";
import { NextResponse } from "next/server"; // Import NextResponse

// Export the POST method handler
// export async function POST(req) {
//   const { name, email, password } = await req.json();

//   // Validate the input
//   if (!name || !email || !password) {
//     return NextResponse.json(
//       { message: "All fields are required" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Connect to MongoDB
//     await dbConnect();

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User already exists" },
//         { status: 400 }
//       );
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create a new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     // Save the new user to the database
//     await newUser.save();

//     // Return a success message
//     return NextResponse.json(
//       { message: "User created successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error during signup:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
export async function POST() {
  try {
    await dbConnect(); // Try to connect to MongoDB
    return NextResponse.json(
      { message: "MongoDB is connected successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { message: "Database connection failed", error: error.message },
      { status: 500 }
    );
  }
}
