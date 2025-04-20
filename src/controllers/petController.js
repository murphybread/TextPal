import * as petService from "#services/petService.js";
import { wrapControllerHandler } from "#utils/loggerUtils.js";
import { logger } from "#config/logger.js";

export const listPets = wrapControllerHandler("petController.listPets", async (req, res, next) => {
  const pets = await petService.getAllPets();
  res.json(pets);
});

export const createPet = wrapControllerHandler("petController.createUser", async (req, res, next) => {
  logger.debug("createPet handler - req.body:", req.body);
  const newPet = await petService.createPet(req.body);
  res.status(201).json(newPet);
});
