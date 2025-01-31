// import express, { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import authRouter from "./routes/auth";
// import productRouter from "./routes/product"
// import connectDB from "./config/config";
// import logger from "./utils/logger";
// import mongoose from "mongoose";

// dotenv.config();

// const PORT = process.env.PORT || 4700;

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get('/health',async(req:Request,res:Response)=>{
//   try{
// const dbState=mongoose.connection.readyState;
// const dbStatus=dbState===1 ? 'connected' : 'disconnected';
// res.status(200).json({
//   status: 'ok',
//   timestamp: new Date(),
//   database: dbStatus,
//   service: 'running'
// });
//   }catch(error){
//     logger.error('Health check failed:', error);
//     res.status(500).json({
//       status: 'error',
//       timestamp: new Date(),
//       database: 'error',
//       service: 'running'
//     });
//   }
// })
// app.use("/auth", authRouter);
// app.use("/product", productRouter);

// connectDB();

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   logger.error(err.message);
//   res.status(500).json({ message: "Something went wrong" });
// });

// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });

import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth";
import productRouter from "./routes/product"
import connectDB from "./config/config";
import logger from "./utils/logger";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 4700;

const app = express();
app.use(cors());
app.use(express.json());

// Add this health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    status: 'ok',
    database: dbState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.use("/auth", authRouter);
app.use("/product", productRouter);

connectDB();

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});