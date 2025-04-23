import { Router } from "express";
import * as petController from "#controllers/petController.js";

import { logger } from "#config/logger.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: 펫(변칙 존재) 관련 API
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     tags: [Pets]
 *     description: 등록된 모든 펫 목록을 반환합니다.
 *     responses:
 *       '200':
 *         description: 펫 목록 조회 성공 (배열 형태 예상)
 *       '500':
 *         description: 서버 내부 오류
 */
router.get("/", async (req, res, next) => {
  logger.info(`GET /pets  called`);
  petController.listPets(req, res, next);
});

/**
 * @swagger
 * /pets:
 *   post:
 *     tags: [Pets]
 *     description: 요청 본문(body)의 정보로 새로운 펫을 생성합니다. (상세 요청 형식은 구현 확인 필요)
 *     responses:
 *       '201':
 *         description: 펫 생성 성공 (생성된 펫 정보 반환 예상)
 *       '400':
 *         description: 잘못된 요청 (필수 필드 누락)
 *       '500':
 *         description: 서버 내부 오류
 */
router.post("/", async (req, res, next) => {
  logger.info(`POST /pets  called`);
  petController.createPet(req, res, next);
});

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     tags: [Pets]
 *     description: 특정 ID를 가진 펫의 정보를 반환합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 펫의 고유 ID (UUID or Number)
 *     responses:
 *       '200':
 *         description: 펫 정보 조회 성공 (펫 정보 반환 예상)
 *       '404':
 *         description: 펫을 찾을 수 없음 (ID가 유효하지 않거나 존재하지 않음)
 *       '500':
 *         description: 서버 내부 오류
 */
router.get("/:id", async (req, res, next) => {
  logger.info(`GET /pets/:id  called`);
  petController.findPetById(req, res, next);
});

/**
 * @swagger
 * /pets/owner/{ownerId}:
 *   get:
 *     tags: [Pets]
 *     description: 경로 파라미터로 받은 소유자(User) ID를 이용하여 해당 사용자가 소유한 모든 펫 목록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         schema:
 *           type: string # 또는 integer
 *         required: true
 *         description: 펫 목록을 조회할 소유자(User)의 고유 ID (UUID or Number)
 *     responses:
 *       '200':
 *         description: 특정 소유자의 펫 목록 조회 성공 (배열 형태 예상)
 *       '404':
 *         description: 해당 소유자를 찾을 수 없거나 펫이 없음
 *       '500':
 *         description: 서버 내부 오류
 */
router.get("/owner/:ownerId", async (req, res, next) => {
  logger.info(`GET /pets/owner/:ownerId  called`);
  petController.findPetsByOwnerId(req, res, next);
});

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     tags: [Pets]
 *     description: 경로 파라미터로 받은 ID를 이용하여 특정 펫을 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 삭제할 펫의 고유 ID (UUID or Number)
 *     responses:
 *       '200': # 또는 '204'
 *         description: 펫 삭제 성공
 *       '404':
 *         description: 삭제할 펫을 찾을 수 없음
 *       '500':
 *         description: 서버 내부 오류
 */
router.delete("/:id", async (req, res, next) => {
  logger.info(`DELETE /pets/:id  called`);
  petController.deletePetById(req, res, next);
});

export default router;
