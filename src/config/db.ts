import "dotenv/config";
import mongoose from "mongoose";
import { Logger } from "./logger";

const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri, {});
    Logger.info("MongoDB connected");
  } catch (e: any) {
    Logger.error(`Error with db connection: ${e.message}`);
  }
};
const disconnectDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    Logger.info("MongoDB disconnected and droped");
  } catch (e: any) {
    Logger.error(`Error with db disconnect: ${e.message}`);
  }
};

export {connectDB, disconnectDB}