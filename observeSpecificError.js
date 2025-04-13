// observeSpecificError.js 라는 이름으로 파일을 만드세요.

import { EventEmitter } from "events";

// 1. 가짜 서버 역할을 할 EventEmitter 객체 생성
const fakeServer = new EventEmitter();

// 2. 'error' 이벤트 리스너 등록: 에러 객체의 주요 속성들을 출력
fakeServer.on("error", (error) => {
  console.log(`\n🔔 --- 'error' 이벤트 수신 --- 🔔`);
  console.log(`▶ 에러 메시지 (error.message): ${error.message}`);
  console.log(`▶ 에러 코드 (error.code):`, error.code); // code는 매우 중요!
  console.log(`▶ 시스템 콜 (error.syscall):`, error.syscall); // syscall도 중요!
  console.log(`▶ 관련 포트 (error.port):`, error.port); // 포트 정보가 있을 수 있음
  console.log(`▶ 관련 주소 (error.address):`, error.address); // 주소 정보가 있을 수 있음
  console.log(`▶ 에러 객체 전체 모습:`);
  console.dir(error, { depth: null }); // 객체를 좀 더 자세히 보기 (stack 포함)
  console.log(Object.getOwnPropertyNames(error));

  console.log(`-------------------------------------\n`);
});

// --- 시뮬레이션 시작 ---

console.log("🧪 시뮬레이션: EADDRINUSE (포트 이미 사용 중) 에러 객체 확인");
// 실제 EADDRINUSE 에러와 유사한 가짜 객체 생성
const fakeEaddrinuseError = new Error("listen EADDRINUSE: address already in use :::3000");
fakeEaddrinuseError.code = "EADDRINUSE"; // <- 실제 에러가 가질 속성
fakeEaddrinuseError.syscall = "listen"; // <- 실제 에러가 가질 속성
fakeEaddrinuseError.port = 3000; // <- 실제 에러가 가질 속성
fakeEaddrinuseError.address = "::"; // <- 실제 에러가 가질 속성
// fakeEaddrinuseError.errno = -4091;       // OS 의존적인 숫자 코드 (참고용)

// 'error' 이벤트 발생시키기
fakeServer.emit("error", fakeEaddrinuseError);

console.log("🧪 시뮬레이션: EACCES (권한 부족) 에러 객체 확인");
// 실제 EACCES 에러와 유사한 가짜 객체 생성
const fakeEaccesError = new Error("listen EACCES: permission denied 0.0.0.0:80");
fakeEaccesError.code = "EACCES"; // <- 실제 에러가 가질 속성
fakeEaccesError.syscall = "listen"; // <- 실제 에러가 가질 속성
fakeEaccesError.port = 80; // <- 실제 에러가 가질 속성
fakeEaccesError.address = "0.0.0.0"; // <- 실제 에러가 가질 속성
// fakeEaccesError.errno = -4092;      // OS 의존적인 숫자 코드 (참고용)

// 'error' 이벤트 발생시키기
fakeServer.emit("error", fakeEaccesError);

console.log("🧪 시뮬레이션: 일반적인 (syscall 없는) 에러 객체 확인");
// code나 syscall 같은 특정 속성이 없는 일반 에러
const genericError = new Error("Something unexpected happened");
genericError.details = "Could not process the request due to an internal issue."; // 임의 속성 추가

// 'error' 이벤트 발생시키기
fakeServer.emit("error", genericError);

try {
  const arr = [1, 2];
  console.log(arr[5]); // RangeError 또는 undefined (환경에 따라 다름), 여기서는 에러 강제 발생
  if (arr[5] === undefined) {
    // 명시적으로 에러 발생
    throw new RangeError("Invalid array index accessed");
  }
} catch (error) {
  // 'error' 이벤트로 전달
  console.dir(error, { depth: null }); // 객체를 좀 더 자세히 보기 (stack 포함)
  console.log(Object.getOwnPropertyNames(error));
}

console.log("✅ 모든 시뮬레이션 완료");
