import mongoose from "mongoose";

let isConnected = false;
//to prevent opening a new connection on every api request
export const connect = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};
