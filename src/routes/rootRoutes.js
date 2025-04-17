import { Router } from "express";
import { logger } from "#config/logger.js";

const router = Router();

router.get("/", (req, res) => {
  logger.info("GET / 요청 처리");
  res.send("Hello World!");
});

export default router;
