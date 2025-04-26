import { QdrantClient } from "@qdrant/qdrant-js";
import "dotenv/config";

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export default qdrantClient;
