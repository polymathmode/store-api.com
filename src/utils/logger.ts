import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "error", 
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), 
    new transports.File({ filename: "error.log" }) 
  ]
});

export default logger;
