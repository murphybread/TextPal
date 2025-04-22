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

export async function findPetById(id) {
  return logAndExecute(
    "findPetById",
    async (id) => {
      return await petModel.findPetById(id);
    },
    id
  );
}


export async function findPetsByOwnerId(ownerId){
  return logAndExecute("findPetsByOwnerId", async (ownerId) => {
    return await petModel.findPetsByOwnerId(ownerId);
  }, ownerId);
}

export async function deletePetById(id){
  return logAndExecute("deletePetById", async (id) => {
    return await petModel.deletePetById(id);
  }, id);
}

