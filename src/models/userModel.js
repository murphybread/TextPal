import "dotenv/config";
import { pool } from "#config/database.js";
import { logger } from "#config/logger.js";

export async function findAllUsers() {
  const { rows } = await pool.query(`SELECT * FROM "users" ORDER BY id`);
  return rows;
}

export async function createUser({ username, email, password }) {
  // 1. 로그 메시지 수정
  logger.debug(`SQL: INSERT INTO users… [${username} ${email}]`);

  const { rows } = await pool.query(
    // 2. SQL 쿼리에서 "name"을 "username"으로 바꾸고, password 컬럼 추가
    `INSERT INTO "users" (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING *`,
    // 3. SQL 파라미터 배열에도 password 추가
    [username, email, password]
  );

  const newUser = rows[0];
  // 4. (보안 강화) 반환하기 전에 결과 객체에서 비밀번호 필드 삭제
  delete newUser.password;

  return newUser;
}