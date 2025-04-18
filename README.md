LLM Text Pal

사용자 입력으로 나만의 펫을 만드는 서비스.
RAG를 통해 특별한 세계의 법칙이 적용된 범위내에서만 생성 가능하며, 생성형 AI를 통해 다양한 펫의 이미지를 생성해줌.
세계를 돌아다니며 상호작용을 통해 펫을 성장시키거나 놀 수 있음.
펫은 이미지, 텍스트 정보, 음성을 가지고 있음.

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

단계를 여러번 나누는 이유: 좀 더 복잡한 기능을 만들기위해 필요한 관심사 분리를 기반으로 아키텍처를 설계하고싶기에

- [] 회원 가입 (DB 등록)
- [] 세션 유지
- [] 소셜 로그인인

app-> routes -> controller-> service -> model-> DB
-> ORM 학습을 위해 Prisma 시도 schema생성 및 Prisma Client까지 생성 후 테스트해봄
-> Prisma검색결과 2배에서 많게는 5배까지 퍼포먼스차이가나며, ORM만 쓰기에 쿼리튜닝이나 오버헤드 등으로DB 학습에는 부적합하다고판단
-> pg로 사용하기로 결정

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
