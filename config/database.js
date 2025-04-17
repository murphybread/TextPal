import pg from "pg";
import "dotenv/config";
const { Pool } = pg;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

export const pool = new Pool(dbConfig);

async function testConnection() {
  let client;
  try {
    console.log("데이터베이스 연결을 시도합니다...");
    client = await pool.connect();
    console.log("PostgreSQL 데이터베이스에 성공적으로 연결되었습니다!");
    const result = await client.query("SELECT NOW()");
    console.log("현재 서버 시간:", result.rows[0].now);
  } catch (error) {
    console.error("데이터베이스 연결 또는 쿼리 중 오류 발생:", error.message);
    console.error("   연결 정보 (비밀번호 제외):", {
      user: dbConfig.user,
      host: dbConfig.host,
      database: dbConfig.database,
      port: dbConfig.port,
    });
    console.error("   에러 스택:", error.stack);
  } finally {
    if (client) {
      client.release();
      console.log("연결이 Pool로 반납되었습니다.");
    }
  }
  console.log("데이터베이스 풀을 닫습니다...");
  await pool.end();
  console.log("데이터베이스 풀이 닫혔습니다.");
}

//  testConnection();
