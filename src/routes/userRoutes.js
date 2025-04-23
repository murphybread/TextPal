import { Router } from "express";
import * as userController from "#controllers/userController.js";
import { logger } from "#config/logger.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 관련 API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     description: 등록된 모든 사용자 목록을 반환합니다.
 *     responses:
 *       '200':
 *         description: 사용자 목록 조회 성공 (배열 형태 예상)
 *       '500':
 *         description: 서버 내부 오류
 */

router.get("/", (req, res, next) => {
  logger.info(`GET /users  called`);
  return userController.listUsers(req, res, next);
});

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     description: 요청 본문(body)의 정보로 새로운 사용자를 생성합니다. (상세 요청 형식은 구현 확인 필요)
 *     responses:
 *       '201':
 *         description: 사용자 생성 성공 (생성된 사용자 정보 반환 예상)
 *       '400':
 *         description: 잘못된 요청 (필수 필드 누락)
 *       '500':
 *         description: 서버 내부 오류
 */
router.post("/", (req, res, next) => {
  logger.info(`POST /users called`);
  userController.createUser(req, res, next);
});

export default router;
