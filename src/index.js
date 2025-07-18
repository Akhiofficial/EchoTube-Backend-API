import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
// Load environment variables from .env file

dotenv.config();

connectDB() 
    .then(() => {
      app.listen(process.env.PORT || 8000, () => {
          console.log(`(main index file) Server is running on port ${process.env.PORT || 8000}`);
      });
    })
    .catch((error) => {
        console.error("MongoDB connection failed !!", error);
        process.exit(1);
    });








/* import express from "express";
const app = express();


;(async () => {
  try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on('error', (error) => {
          console.error("Error connecting to the database:", error);
          throw error;
        });

        app.listen(process.env.PORT, () => {
          console.log(`Server is running on port ${process.env.PORT}`);
        });
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
})();


connectDB();
export default connectDB;
*/ 
