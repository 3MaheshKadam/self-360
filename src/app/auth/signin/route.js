import bcrypt from "bcryptjs";
import User from "../../../../models/User.js"; // Adjusted path
import dbConnect from "../../../../lib/dbConnect.js";
import { NextResponse } from "next/server"; // Import NextResponse

import jwt from "jsonwebtoken"; // You will need to install the `jsonwebtoken` package

export async function POST(req) {
  const { email, password } = await req.json();

  // Validate input
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    // Connect to MongoDB
    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 400 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret key (make sure it's in your .env.local)
      { expiresIn: "1h" } // Token expiration time
    );

    // Return success with the JWT token
    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during signin:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
