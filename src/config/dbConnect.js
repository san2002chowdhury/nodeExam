import mongoose from "mongoose";
import dotenv from "dotenv/config";

const URL = process.env.URL;

export async function dbConnect() {
  try {
    await mongoose.connect(URL);
    console.log("Database connected successfully!");
  } catch (e) {
    console.log(e);
    console.log("Database not connected!");
  }
}
