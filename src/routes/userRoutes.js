import { Router } from "express";
import * as userController from "#controllers/userController.js";
import { logger } from "#config/logger.js";

const router = Router();

router.get("/", (req, res, next) => {
  logger.info(`GET /users  called`);
  return userController.listUsers(req, res, next);
});

router.post("/", (req, res, next) => {
  logger.info(`POST /users called`);
  userController.createUser(req, res, next);
});

export default router;
