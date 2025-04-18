import { Router } from "express";
import { logger } from "#config/logger.js";

const router = Router();

router.get("/", (req, res) => {
  logger.info("GET / 요청 처리");
  res.send("Hello World!");
});

router.get("/session-test", (req, res) => {
  logger.info("GET /session-test 요청 처리");

  req.session.viewCount = (req.session.viewCount || 0) + 1;

  res.json({
    message: "세션 테스트 성공",
    viewCount: req.session.viewCount,
    sessionID: req.sessionID,
  });
});

export default router;
