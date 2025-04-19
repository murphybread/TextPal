import pg from "pg";
import "dotenv/config";
import { logger } from "./logger.js"; // Import the logger
const { Pool } = pg;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

const dbNeonConfig = {
  user: process.env.NEON_PG_USER,
  password: process.env.NEON_PG_PASSWORD,
  host: process.env.NEON_PG_HOST,
  database: process.env.NEON_PG_DATABASE,
  ssl: {
    require: process.env.NEON_PG_SSL_REQUIRE,
  },
};

export const pool = new Pool(dbConfig);
export const neonPool = new Pool(dbNeonConfig);

async function testConnection() {
  let client;
  try {
    logger.info("데이터베이스 연결을 시도합니다...");
    client = await pool.connect();
    logger.info("PostgreSQL 데이터베이스에 성공적으로 연결되었습니다!");
    const result = await client.query("SELECT NOW()");
    logger.info(`현재 서버 시간: ${result.rows[0].now}`);
  } catch (error) {
    logger.error(`데이터베이스 연결 또는 쿼리 중 오류 발생: ${error.message}`, {
      error: error,
      connectionInfo: {
        user: dbConfig.user,
        host: dbConfig.host,
        database: dbConfig.database,
        port: dbConfig.port,
      },
      stack: error.stack,
    });
  } finally {
    if (client) {
      client.release();
      logger.info("연결이 Pool로 반납되었습니다.");
    }
  }
  logger.info("데이터베이스 풀을 닫습니다...");
  await pool.end();
  logger.info("데이터베이스 풀이 닫혔습니다.");
}

async function testNeonConnection() {
  let client;
  try {
    logger.info("Neon 데이터베이스 연결을 시도합니다...");
    client = await neonPool.connect();
    logger.info("Neon PostgreSQL 데이터베이스에 성공적으로 연결되었습니다!");
    const result = await client.query("SELECT NOW()");
    logger.info(`현재 서버 시간: ${result.rows[0].now}`);
  } catch (error) {
    logger.error(`Neon 데이터베이스 연결 또는 쿼리 중 오류 발생: ${error.message}`, {
      error: error,
      connectionInfo: {
        user: dbNeonConfig.user,
        host: dbNeonConfig.host,
        database: dbNeonConfig.database,
        port: dbNeonConfig.port,
      },
      stack: error.stack,
    });
  } finally {
    if (client) {
      client.release();
      logger.info("Neon 연결이 Pool로 반납되었습니다.");
    }
  }
  logger.info("Neon 데이터베이스 풀을 닫습니다...");
  await neonPool.end();
  logger.info("Neon 데이터베이스 풀이 닫혔습니다.");
}

//  testConnection();
// testNeonConnection();
