import mongoose from "mongoose";
import dotenv from "dotenv"
import logger from "../utils/logger";
dotenv.config()

const connectDB=async()=>{
 try{
    const conn=await mongoose.connect(process.env.MONGO_URI as string)
    console.log(`Connected to database successfully:${conn.connection.host}`);
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

 }catch(error){
console.log(error);
logger.error('Failed to connect to database:', error);
process.exit(1)
 }


}
export default connectDB
