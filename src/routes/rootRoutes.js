import { Router } from "express";
import { logger } from "#config/logger.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Root
 *   description: 루트 경로 및 기본 기능
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Root]
 *     description: 서버 동작 확인 및 간단한 환영 메시지 반환.
 *     responses:
 *       '200':
 *         description: 성공 (Hello World!)
 */
router.get("/", (req, res) => {
  logger.info("GET / 요청 처리");
  res.send("Hello World!");
});

/**
 * @swagger
 * /session-test:
 *   get:
 *     tags: [Root]
 *     description: 세션 작동 테스트용 엔드포인트. 방문 횟수와 세션 ID 반환.
 *     responses:
 *       '200':
 *         description: 세션 정보 포함 성공 응답 (상세 내용은 구현 확인 필요)
 */
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
