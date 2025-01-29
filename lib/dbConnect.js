import mongoose from "mongoose";

let isConnected = false; // To track the connection status

const dbConnect = async () => {
  if (isConnected) {
    console.log("Already connected to the database.");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;
    if (isConnected) {
      console.log("Connected to MongoDB.");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw new Error("Failed to connect to the database.");
  }
};

export default dbConnect;
