LLM Text Pal

사용자 입력으로 나만의 펫을 만드는 서비스.
RAG를 통해 특별한 세계의 법칙이 적용된 범위내에서만 생성 가능하며, 생성형 AI를 통해 다양한 펫의 이미지를 생성해줌.
세계를 돌아다니며 상호작용을 통해 펫을 성장시키거나 놀 수 있음.
펫은 이미지, 텍스트 정보, 음성을 가지고 있음.
Inspired by the SCP Foundation (CC BY-SA 3.0)

번호는 나중에 RAG에의해 붙음. 그 전까지는 고유이름? 정도
처음에 가챠처럼 나옴. 이후 이상현상을 쌓음으로서 번호를 얻을 자격이 생김

기능 개발 목록

ServerSide

- [x] server.listen 정보 출력(동작한 서버의 Address, host 파악)
- [x] server 동작시 error 이벤트처리 (listen이 되지 않는 error상황에서의 정보 제공)
- [x] logger 설정 (morgan 및 winston으로 영구적인 서버이벤트 및 http request 정보 저징)
- [x] DB 연결 (pg를 통해 로컬 DB와연결 .env활용)
- [x] **GET /users – 사용자 목록 조회 API** 개발

  - [x] routes 설정 (`router.get('/', userController.listUsers)`)
  - [x] controller 구현 (`listUsers`)
  - [x] service 구현 (`getAllUsers`)
  - [x] model 구현 (`findAllUsers`)

- [x] **POST /users – 신규 사용자 생성 API** 개발

  - [x] routes 설정 (`router.post('/', userController.createUser)`)
  - [x] controller 구현 (`createUser`)
  - [x] service 구현 (`createUser`)
  - [x] model 구현 (`createUser`)

- [x] 세션 유지

  - 사용자 인증을 다시 입력하지 않게하고, 장바구니 등과 같은 커스텀 정보값을 유지하기 위해 설정 필요
  - 외부 세션저장 메모리를 쓰는것이 권장되지만 현재 단계에서는 간단하게 로컬서버에서 설정(서버가 내려가면 세션 정보 전부 사라짐짐)
  - 세션 지원 미들웨어인 `express-session`으로 구현
  - 클라이언트 쿠키는 session ID만 저장, 서버에서는 ID와 매핑되는 session의 프로퍼티들 저장

- [] Pet model 정의하기

  - 관게먼저 1:N (1명의 유저와 여러마리의 펫)형태로 정의
  - 어떤 Columns가 들어갈지 고려해보기
    - id
    - name
    - owener_id
    - image
    - text_description
    - state
    - growth_level
    - status
      - mood
      - illness
    - anomalous
    - object_class
    - lore

- [] RAG Knowledge Base 설계 및 구축:
- [] Pet 생성 기능
- [] 보유하고있는 Pet 조회 기능
- [] 펫 상호작용 API

- [] 소셜 로그인
  - 일반 회원 로그인 대신 더 나은 UX 경험을 위해 Google,X (Twitter)로그인 제공하기. 사용자 고려해서 요청이 많은 경우 추가 소셜로그인 방식 도입

app-> routes -> controller-> service -> model-> DB
단계를 여러번 나누는 이유: 좀 더 복잡한 기능을 만들기위해 필요한 관심사 분리를 기반으로 아키텍처를 설계하고싶기에

#### Prisma대신 pg 사용하는 이유

-> ORM 학습을 위해 Prisma 시도 schema생성 및 Prisma Client까지 생성 후 테스트해봄
-> Prisma검색결과 2배에서 많게는 5배까지 퍼포먼스차이가나며, ORM만 쓰기에 쿼리튜닝이나 오버헤드 등으로DB 학습에는 부적합하다고판단
-> pg로 사용하기로 결정

## 디렉토리 구조

TextPal/
├── babel.config.json
├── observeSpecificError.js
├── package.json
├── README.md
├── **test**/ # 테스트 파일 디렉토리
├── config/ # 설정 파일 디렉토리
│ ├── database.js # DB 설정
│ ├── session.js # 세션 설정
│ └── logger.js # 로깅 설정
├── logs/ # 로그 저장 디렉토리
│ └── app.log
├── migrations/ # DB 마이그레이션 파일
│ └── 0001_set-updatedAt-default.sql
├── public/ # 정적 파일 디렉토리
└── src/ # 소스 코드 메인 디렉토리
├── app.js # 애플리케이션 진입점
├── api/  
 │ └── users/ # 사용자 관련 API
├── controllers/ # 컨트롤러 레이어
│ └── userController.js
├── models/ # 모델 레이어
│ └── userModel.js
├── routes/ # 라우팅 레이어
│ ├── rootRoutes.js
│ └── userRoutes.js
└── services/ # 서비스 레이어
└── userService.js

# Neon DB

무료 웹 호스팅 DB. Local에서 sql조작, 테스트 등을 수행하지만 나중에 퍼블릭한 상황에 대응하기 위한 무료 serverless DB 호스팅
190컴퓨팅시간이 무료이며 개발 환경스펙은 0.25컴퓨팅 시간을 사용함으로 약 31일동안 full로 돌려도 괜찮은 수준.

[Free plan](https://supabase.com/pricing)

- size: 500MB
- API request: unlimited

[Computing Unit](https://neon.tech/docs/introduction/usage-metrics#compute)
1 vCPU 컴퓨트가 1시간 동안 활성 상태가 1CU이며,각 vCPU마다 RAM 크기가 고정됨. 0.25vCPU는 1GB이며 1vCPU당 4GB

Free plan 무료 CU: https://neon.tech/docs/introduction/plans#free-plan

[기본 연결시간](https://neon.tech/docs/connect/connection-latency?utm_source=chatgpt.com#check-the-status-of-a-compute)
5분. Free plan은 늘리거나 줄이기 변경불가.
serverless 방식임으로 첫 연결 cold start이후 5분간 활성화되고, activity가 되는 시간으로 무료 CU 자원 소모

# [SCP license관련](https://scpko.wikidot.com/licensing-guide)

- (CC BY-SA 3.0
- **SCP 재단의 일반적인 설정 (캐릭터, 요주의 단체, 세계관 등)**을 활용했다면, SCP 위키의 대문 주소(https://scpko.wikidot.com 등)를 표시해야 합니다.
