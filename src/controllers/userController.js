import * as userService from "#services/userService.js";
import { logger } from "#config/logger.js";

export async function listUsers(req, res, next) {
  logger.debug("userController.listUsers 시작");
  try {
    const users = await userService.getAllUsers();
    logger.debug("userService.getAllUsers 완료");
    res.json(users);
  } catch (err) {
    logger.error("listUsers 에러", err);
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  logger.debug("userController.createUser 시작");
  try {
    const newUser = await userService.createUser(req.body);
    logger.debug("userService.createUser 완료");
    res.status(201).json(newUser);
  } catch (err) {
    logger.error("createUser 에러", err);

    next(err);
  }
}
