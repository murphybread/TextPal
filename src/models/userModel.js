import "dotenv/config";
import { pool } from "#config/database.js";
import { logger } from "#config/logger.js";

export async function findAllUsers() {
  const { rows } = await pool.query(`SELECT * FROM "users" ORDER BY id`);
  return rows;
}

export async function createUser({ name, email }) {
  logger.debug(`SQL: INSERT INTO users… [${name} ${email}]`);
  const { rows } = await pool.query(
    `INSERT INTO "users" (name, email)
     VALUES ($1, $2)
     RETURNING *`,
    [name, email]
  );
  return rows[0];
}
