// test/scripts/run-model-interactive.js

// .env 파일 로드
import "dotenv/config";

// readline 모듈 임포트
import readline from "readline";

// DB Pool 및 Model 함수 임포트 (경로 수정 필요)
import { pool } from "#config/database.js";
import { logger } from "#config/logger.js";
import {
  findAllPets,
  createPetOperator,
  findPetById,
  findPetsByOwnerId,
  deletePetById,
  // 다른 Model 함수들도 여기에 import
} from "#models/petModel.js";

// readline 인터페이스 생성
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 테스트할 함수들을 맵 형태로 정의 (메뉴 번호와 연결)
const testFunctions = {
  1: { name: "findAllPets", description: "모든 펫 조회", func: findAllPets, params: [] },
  2: { name: "createPetOperator", description: "신규 펫 생성", func: createPetOperator, params: ["owner_id (UUID)", "name (string)"] },
  3: { name: "findPetById", description: "특정 ID로 펫 조회", func: findPetById, params: ["id (UUID)"] },
  4: { name: "findPetsByOwnerId", description: "특정 Owner ID로 펫 목록 조회", func: findPetsByOwnerId, params: ["owner_id (UUID)"] },
  5: { name: "deletePetById", description: "특정 ID로 펫 삭제", func: deletePetById, params: ["id (UUID)"] },
  // 다른 함수들도 여기에 추가
};

// 메뉴 출력 함수
function printMenu() {
  console.log("\n===================================");
  console.log("    Model Function Interactive Test  ");
  console.log("===================================");
  for (const key in testFunctions) {
    const funcInfo = testFunctions[key];
    console.log(`${key}. ${funcInfo.description} (${funcInfo.name})`);
  }
  console.log("e. 종료");
  console.log("===================================");
}

// 사용자 입력 대기 및 처리 함수 (재귀 호출 또는 루프 사용)
async function promptUser() {
  printMenu();

  rl.question('Select a command number or type "e" to exit: ', async (input) => {
    const commandKey = input.trim();

    if (commandKey.toLowerCase() === "e") {
      // 종료 처리
      console.log("\nClosing DB pool...");
      await pool.end();
      console.log("DB pool closed.");
      rl.close(); // readline 인터페이스 종료
      return; // 함수 종료
    }

    const funcInfo = testFunctions[commandKey];

    if (!funcInfo) {
      console.log("Invalid input. Please enter a valid number or 'e'.");
      promptUser(); // 다시 프롬프트
      return;
    }

    // 함수 실행
    console.log(`\n--- Executing ${funcInfo.name} ---`);

    try {
      let result = null;

      // 매개변수 처리 (간단 예시, 실제 구현은 복잡해질 수 있음)
      if (funcInfo.params.length > 0) {
        const params = [];
        for (const paramDesc of funcInfo.params) {
          // 사용자에게 각 매개변수를 입력받는 로직 필요
          // rl.question()은 비동기이므로 Promise/async/await으로 처리해야 함
          const paramValue = await new Promise((resolve) => {
            rl.question(`Enter value for ${paramDesc}: `, (value) => resolve(value.trim()));
          });
          // 필요시 데이터 타입 변환 또는 유효성 검사
          params.push(paramValue);
        }

        // Model 함수 호출 (매개변수 개수 및 형태에 따라 유연하게 처리 필요)
        // 여기서는 간단하게 배열 형태로 전달받는 함수들만 가정
        if (funcInfo.name === "createPetOperator") {
          // createPetOperator는 객체 { owner_id, name } 형태를 기대하므로 별도 처리
          result = await funcInfo.func({ owner_id: params[0], name: params[1] });
        } else if (funcInfo.params.length === 1) {
          // 매개변수 1개인 함수 (findPetById, findPetsByOwnerId, deletePetById)
          result = await funcInfo.func(params[0]);
        } else {
          // 그 외 매개변수 여러 개인 함수 (예시에서는 없지만)
          console.error(`Parameter handling not implemented for ${funcInfo.name} with ${params.length} parameters.`);
          result = "Error: Parameter handling not implemented.";
        }
      } else {
        // 매개변수 없는 함수 (findAllPets)
        result = await funcInfo.func();
      }

      console.log(`${funcInfo.name} Result:`, result);
      // 추가적인 결과 메시지 또는 검증 로직 추가
    } catch (error) {
      console.error(`\n--- Execution of ${funcInfo.name} Failed ---`);
      console.error("An error occurred:", error);
      // logger.error(`Execution of ${funcInfo.name} error:`, error);
    }

    // 다음 프롬프트 대기 (재귀 호출)
    promptUser();
  });
}

// 스크립트 시작 시 안내 메시지 및 첫 프롬프트 호출
console.log("Starting Model Interactive Test...");
promptUser(); // 첫 프롬프트 실행

// 프로세스 종료 시 DB Pool 연결 종료를 보장
process.on("exit", async () => {
  console.log("\nProcess exiting, closing DB pool...");
  // exit 이벤트 핸들러에서는 비동기 작업(await)이 제대로 동작하지 않을 수 있습니다.
  // rl.close()를 호출하거나, 스크립트가 종료될 때 pool.end()가 호출되도록 다른 방법 고려
  // await pool.end(); // 이 부분은 exit 이벤트에서 신뢰할 수 없습니다.
  // pool.end()는 'e' 입력 시 promptUser()의 콜백에서 이미 처리됩니다.
});
// SIGINT (Ctrl+C) 처리 - 깔끔한 종료
process.on("SIGINT", () => {
  console.log("\nSIGINT received. Exiting gracefully...");
  rl.close(); // readline 종료
  // rl.close()는 'close' 이벤트를 발생시키고, 이때 pool.end() 등을 호출할 수 있음
});
// SIGTERM (kill 명령 등) 처리
process.on("SIGTERM", () => {
  console.log("\nSIGTERM received. Exiting gracefully...");
  rl.close(); // readline 종료
});

// rl.on('close', async () => {
//     // readline이 닫힐 때 실행되는 로직
//     console.log("Readline closed.");
//     // 여기서 pool.end()를 호출하는 것도 방법
//     // await pool.end(); // rl.close() 호출 후 여기서 pool.end() 실행
// });
