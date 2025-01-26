import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth";
import connectDB from "./config/config";
import logger from "./utils/logger";

dotenv.config();

const PORT = process.env.PORT || 4700;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

connectDB();

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
