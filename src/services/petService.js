import * as petModel from "#models/petModel.js";
import { logAndExecute } from "#utils/loggerUtils.js";

export async function getAllPets() {
  return logAndExecute("getAllPets", async () => {
    return await petModel.findAllPets();
  });
}
export async function createPet(data) {
  return logAndExecute(
    "createPet",
    async (petData) => {
      return await petModel.createPetOperator(petData);
    },
    data
  );
}

// findPetById;
// findPetsByOwnerId;
// deletePetById;
