import "dotenv/config";

// 상대 경로 대신 #imports를 사용하도록 수정
import { createUser } from "#models/userModel.js";
import { createPetWithTransaction } from "#models/petModel.js";
import { pool } from "#config/database.js";

async function runTest() {
  console.log(" 트랜잭션 모델 테스트를 시작합니다...");

  let testUser;
  const client = await pool.connect();

  try {
    // 1. 사전 준비 (Given): 테스트용 유저 생성
    console.log("1. 테스트용 유저를 생성합니다...");
    testUser = await createUser({
      username: "Test Transaction User", // users 테이블 스키마에 맞게 username으로 수정
      email: `test-${Date.now()}@transaction.com`,
      password: "testpassword", // users 테이블에 password 필드가 NOT NULL일 경우 필요
    });
    console.log(`  > 유저 생성 완료 (ID: ${testUser.id}, pet_count: ${testUser.pet_count})`);
    if (testUser.pet_count !== 0) {
      throw new Error("테스트 유저의 초기 pet_count가 0이 아닙니다!");
    }

    // 2. 실행 (When): 펫 생성 트랜잭션 함수 호출
    console.log("\n2. createPetWithTransaction 함수를 호출합니다...");
    const newPet = await createPetWithTransaction({
      owner_id: testUser.id,
      name: "Transactional Pet",
    });
    console.log(`  > 펫 생성 완료 (이름: ${newPet.name})`);

    // 3. 검증 (Then): 데이터베이스 상태 확인
    console.log("\n3. 데이터베이스 상태를 검증합니다...");
    const petResult = await client.query("SELECT * FROM pets WHERE id = $1", [newPet.id]);
    if (petResult.rowCount !== 1) {
      throw new Error("검증 실패: 생성된 펫을 DB에서 찾을 수 없습니다.");
    }
    console.log("  ✅ [성공] pets 테이블 검증 완료");

    const userResult = await client.query("SELECT pet_count FROM users WHERE id = $1", [testUser.id]);
    const finalPetCount = userResult.rows[0].pet_count;

    if (finalPetCount !== 1) {
      throw new Error(`검증 실패: pet_count가 1이 아니라 ${finalPetCount}입니다.`);
    }
    console.log(`  ✅ [성공] users 테이블의 pet_count 검증 완료 (최종 카운트: ${finalPetCount})`);

    console.log("\n🎉 모든 테스트를 통과했습니다!");
  } catch (error) {
    console.error("\n❌ 테스트 실패:", error);
  } finally {
    // 4. 정리 (Cleanup): 테스트 데이터 삭제
    if (testUser) {
      console.log("\n4. 테스트 데이터를 정리합니다...");
      await client.query("DELETE FROM pets WHERE owner_id = $1", [testUser.id]);
      await client.query("DELETE FROM users WHERE id = $1", [testUser.id]);
      console.log("  > 정리 완료.");
    }
    client.release();
    pool.end();
  }
}

runTest();
