import mongoose from "mongoose";
import { DB_NAME } from "./../constants.js";

let dbConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`,
    );
  } catch (error) {
    console.log(error);
  }
};

export default dbConnection;
