import express from "express";
import "dotenv/config";
import morgan from "morgan";
import { logger, stream } from "../config/logger.js";
import rootRouter from "#routes/rootRoutes.js";
import userRouter from "#routes/userRoutes.js";
import petRouter from "#routes/petRouters.js";
import session from "express-session";
import sessionConfig from "#config/session.js";

const SERVER_PORT = parseInt(process.env.SERVER_PORT) || 3000;
const HOST = process.env.HOST || "localhost";

logger.info(`환경변수 사용: SERVER_PORT=${SERVER_PORT}, Host=${HOST}`);

const app = express();

// Register middlewares
const morganFormat = process.env.NODE_ENV === "development" ? "combined" : "combined";
app.use(morgan(morganFormat, { stream: stream }));
app.use(express.json());
app.use(session(sessionConfig));

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/pets", petRouter);

const server = app.listen(SERVER_PORT, HOST);

server.on("error", (error) => {
  if (error.syscall === "listen") {
    logger.error("Error: Server failed to start.", error);
  } else {
    logger.error("Error: An unexpected error occurred.", error);
  }

  switch (error.code) {
    case "EADDRINUSE":
      logger.error(`Error: Port ${SERVER_PORT} is already in use.`);
      break;
    case "EACCES":
      logger.error(`Error: Permission denied for port ${SERVER_PORT}.`);
      break;
    default:
      logger.error("Error: An unexpected error occurred.", error);
  }
});

server.on("listening", () => {
  try {
    const addressInfo = server.address();
    if (addressInfo) {
      const bindAddress = addressInfo.address;
      const bindPort = addressInfo.port;

      logger.info("서버 리스닝 성공!");
      logger.info(`   - 주소: ${bindAddress}`);
      logger.info(`   - 포트: ${bindPort}`);
      logger.info(`   - 접속 URL (로컬): http://${bindAddress === "::1" || bindAddress === "127.0.0.1" ? "localhost" : bindAddress}:${bindPort}`);
    } else {
      logger.error("Error: Unable to retrieve address information.");
    }
  } catch (error) {
    logger.error("Error occurred while starting the server:", error);
  }
});
