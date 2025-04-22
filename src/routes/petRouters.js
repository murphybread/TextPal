import { Router } from "express";
import * as petController from "#controllers/petController.js";

import { logger } from "#config/logger.js";

const router = Router();

router.get("/", async (req, res, next) => {
  logger.info(`GET /pets  called`);
  petController.listPets(req, res, next);
});
router.post("/", async (req, res, next) => {
  logger.info(`POST /pets  called`);
  petController.createPet(req, res, next);
});

router.get("/:id", async (req, res, next) => {
  logger.info(`GET /pets/:id  called`);
  petController.findPetById(req, res, next);
});

router.get("/owner/:ownerId", async (req, res, next) => {
  logger.info(`GET /pets/owner/:ownerId  called`);
  petController.findPetsByOwnerId(req, res, next);
});

router.delete("/:id", async (req, res, next) => {
  logger.info(`DELETE /pets/:id  called`);
  petController.deletePetById(req, res, next);
});

export default router;
