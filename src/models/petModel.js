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

export async function createPetWithTransaction({ owner_id, name }) {
  // 로그 메시지를 더 명확하게 수정
  logger.debug(`SQL Transaction: INSERT pet AND UPDATE user's pet_count [owner: ${owner_id}, pet: ${name}]`);

  // pool에서 트랜잭션을 위한 전용 클라이언트(연결)를 하나 가져옵니다.
  const client = await pool.connect();

  try {
    // 1. 트랜잭션 시작
    await client.query("BEGIN");

    // 2. 펫 생성 쿼리 (기존과 동일)
    // 이 쿼리가 먼저 성공해야 다음으로 넘어갑니다.
    const petResult = await client.query(`INSERT INTO pets (owner_id, name) VALUES ($1, $2) RETURNING *`, [owner_id, name]);

    // 3. 주인의 pet_count를 1 증가시키는 쿼리 (핵심 추가 부분!)
    // owner_id를 사용해서 어떤 유저의 카운트를 올릴지 지정합니다.
    await client.query(`UPDATE "users" SET pet_count = pet_count + 1 WHERE id = $1`, [owner_id]);

    // 4. 모든 쿼리가 오류 없이 성공했을 경우, 변경사항을 데이터베이스에 최종 확정(저장)합니다.
    await client.query("COMMIT");

    // 함수는 성공적으로 생성된 펫의 정보를 반환합니다.
    return petResult.rows[0];
  } catch (e) {
    // try 블록 안의 쿼리(INSERT 또는 UPDATE) 중 하나라도 실패하면 이 곳으로 옵니다.
    // 5. 작업 중 문제가 발생했으므로, 트랜잭션 시작 이후의 모든 변경사항을 취소(원상복구)합니다.
    await client.query("ROLLBACK");

    // 에러를 로깅하고, 함수를 호출한 상위 코드로 에러를 다시 던져서 문제를 알립니다.
    logger.error("Transaction failed for createPetWithTransaction, rolled back.", e);
    throw e;
  } finally {
    // 6. 트랜잭션이 성공(COMMIT)하든 실패(ROLLBACK)하든 상관없이,
    // 사용했던 데이터베이스 연결은 반드시 pool에 반납해야 합니다.
    client.release();
  }
}