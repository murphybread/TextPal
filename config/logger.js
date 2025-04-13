import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "..", "logs");

if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });

    console.log(`로그 디렉토리 생성 (logger.js): ${logDir}`);
  } catch (error) {
    console.error(`로그 디렉토리 생성 실패 (logger.js): ${logDir}`, error);

    process.exit(1);
  }
}

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((info) => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`)
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "http",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(logFormat),
    }),
  ],
});

const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export { logger, stream };
