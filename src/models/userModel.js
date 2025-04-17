import "dotenv/config";
import { pool } from "#config/database.js";
import { logger } from "#config/logger.js";

export async function findAllUsers() {
  const { rows } = await pool.query(`SELECT * FROM "User" ORDER BY id`);
  return rows;
}

export async function createUser({ name, email }) {
  logger.debug(`SQL: INSERT INTO User… [${name} ${email}]`);
  const { rows } = await pool.query(
    `INSERT INTO "User" (name, email)
     VALUES ($1, $2)
     RETURNING *`,
    [name, email]
  );
  return rows[0];
}
