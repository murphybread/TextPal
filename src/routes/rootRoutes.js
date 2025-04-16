import express from "express";
import { logger } from "#config/logger.js";
import 
const router = express.Router();

router.get("/", (req, res) => {
  logger.info("GET / 요청 처리");
  res.send("Hello World!");
});

export default router;
