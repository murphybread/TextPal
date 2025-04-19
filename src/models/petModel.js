import "dotenv/config";
import { pool } from "#config/database.js";
import { logger } from "#config/logger.js";

export async function findAllPets() {
  const { rows } = await pool.query(`SELECT * FROM "pets" ORDER BY id`);
  return rows;
}

export async function createPetOperator({ owner_id, name }) {
  logger.debug(`SQL: INSERT INTO pets... [${name}]`);
  const { rows } = await pool.query(
    `INSERT INTO pets (owner_id, name)
        VALUES ($1, $2)
        RETURNING *`,
    [owner_id, name]
  );
  return rows[0];
}

// 특정 ID로 펫 조회
// SELECT * FROM pets WHERE id = $1
// uuid 타입의 id를 인자로 받음
export async function findPetById(id) {
  logger.debug(`SQL: SELECT * FROM "pets" WHERE id = $1 [${id}]`);
  try {
    const { rows } = await pool.query(`SELECT * FROM "pets" WHERE id = $1`, [id]);
    // id는 UNIQUE 하므로 결과는 최대 1개 행
    return rows[0]; // 첫 번째 행 데이터 반환 (해당 ID의 펫이 없으면 undefined)
  } catch (error) {
    logger.error(`Error in findPetById (${id}):`, error);
    throw error;
  }
}

// 특정 Owner ID로 펫 목록 조회
// SELECT * FROM pets WHERE owner_id = $1
// uuid 타입의 owner_id를 인자로 받음
export async function findPetsByOwnerId(owner_id) {
  logger.debug(`SQL: SELECT * FROM "pets" WHERE owner_id = $1 [${owner_id}]`);
  try {
    const { rows } = await pool.query(`SELECT * FROM "pets" WHERE owner_id = $1 ORDER BY created_at ASC`, [owner_id]); // 생성 순서대로 정렬
    return rows; // 해당 Owner의 펫 데이터 배열 반환 (없으면 빈 배열 [])
  } catch (error) {
    logger.error(`Error in findPetsByOwnerId (${owner_id}):`, error);
    throw error;
  }
}

// 펫 삭제
// DELETE FROM pets WHERE id = $1
// uuid 타입의 id를 인자로 받음
export async function deletePetById(id) {
  logger.debug(`SQL: DELETE FROM "pets" WHERE id = $1 [${id}]`);
  try {
    const { rowCount } = await pool.query(`DELETE FROM "pets" WHERE id = $1`, [id]);
    // rowCount는 삭제된 행의 개수 (삭제 성공 시 1, 해당 ID의 펫이 없으면 0)
    return rowCount > 0; // 삭제 성공 여부 (boolean) 반환
  } catch (error) {
    logger.error(`Error in deletePet (${id}):`, error);
    throw error;
  }
}
