import qdrantClient from "#config/qdrantClient.js";
import { logger } from "#config/logger.js";

const VECTOR_SIZE = 1536;
const DISTANCE_METRIC = "Cosine";

async function createMyCollectionWithLogging() {
  const collectionName = "test_anomaly_pets";

  logger.info(`Attempting to create or check collection: "${collectionName}"`);

  try {
    logger.debug(`Checking if collection "${collectionName}" already exists...`);

    const existsResponseResult = await qdrantClient.collectionExists(collectionName);
    const collectionExists = existsResponseResult?.exists ?? false;

    if (collectionExists) {
      logger.info(`Collection "${collectionName}" already exists. Skipping creation.`);
    } else {
      logger.info(`Collection "${collectionName}" does not exist. Attempting to create...`);

      const createSuccess = await qdrantClient.createCollection(collectionName, {
        vectors: {
          size: VECTOR_SIZE,
          distance: DISTANCE_METRIC,
        },
        timeout: 10,
      });

      if (createSuccess === true) {
        logger.info(`Collection "${collectionName}" created successfully.`);
      } else {
        logger.error(`Failed to create collection "${collectionName}". Creation returned false.`);
      }
    }
  } catch (error) {
    logger.error(`Error during collection "${collectionName}" creation process:`, error);
    if (error.response) {
      logger.error(`API error: ${error.response.status} - ${error.response.data?.status?.error || "Unknown error"}`);
    } else {
      logger.error("Unexpected error:", error.message);
    }
  } finally {
    logger.info(`Finished process for collection: "${collectionName}"`);
  }
}

createMyCollectionWithLogging();
