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
