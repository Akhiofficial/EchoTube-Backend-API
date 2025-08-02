import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";



const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\n MongoDB is connected successfully !! 
            Database Host: ${connectionInstance.connection.host}`);
            console.log(connectionInstance);
    } catch (error) {
        console.error("Database  connection failed from db/index.js file:", error);
        process.exit(1);  
    }
}

export default connectDB;