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

export const findPetById = wrapControllerHandler(
  "petController.findPetById",
  async (req, res, next) => {
    logger.debug("findPetById handler - req.params.id:", req.params.id); 
    const pet = await petService.findPetById(req.params.id);
    res.status(200).json(pet);
  }
)

export const findPetsByOwnerId = wrapControllerHandler(
  "petController.findPetsByOwnerId",
  async (req, res, next) => {
    logger.debug("findPetsByOwnerId handler - req.params.ownerId:", req.params.ownerId);
    const pets = await petService.findPetsByOwnerId(req.params.ownerId);
    res.status(200).json(pets);
  }
)

export const deletePetById = wrapControllerHandler(
  "petController.deletePetById",
  async (req, res, next) => {
    logger.debug("deletePetById handler - req.params.id:", req.params.id);
    const pet = await petService.deletePetById(req.params.id);
    res.status(200).json(pet);
  }
)
