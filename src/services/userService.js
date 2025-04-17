import * as userModel from "#models/userModel.js";
import { logger } from "#config/logger.js";

export async function getAllUsers() {
  return await userModel.findAllUsers();
}
export async function createUser(data) {
  logger.debug("createUser 비즈니스 로직 시작");
  const { name, email } = data;
  const result = await userModel.createUser(data);
  logger.debug("createUser 비즈니스 로직 완료");
  return result;
}
