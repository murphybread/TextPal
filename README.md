LLM Text Pal

사용자 입력으로 나만의 변칙 존재(Pet)를 만드는 서비스.
RAG를 통해 특별한 세계의 법칙이 적용된 범위내에서만 생성 가능하며, 생성형 AI를 통해 다양한 펫의 이미지를 생성해줌.
이 변칙 존재는 **특정 세계의 규칙(RAG)** 안에서 다른 변칙 존재와 상호작용하며 **이상 현상 기록(Lore)**을 쌓아 성장하고 고유해짐.
펫은 이미지, 텍스트 정보, 음성을 가지고 있음.
Inspired by the SCP Foundation (CC BY-SA 3.0)

**컨셉:**

- 처음 변칙 존재 생성 시 **가챠 시스템**을 통해 초기 '변칙성 잠재력'에 따라 **등급 (Class)**이 부여될 수 있습니다. (예: Minor, Standard, Significant 등) 초기 등급이 높을수록 잠재력이 크거나 초기 능력이 유리할 수 있습니다.
- 처음 생성된 변칙 존재는 이름만 가지며 '미분류 개체' 상태.
- 세계 규칙(RAG) 하에서 상호작용을 통해 **이상 현상 기록(Lore)**을 쌓음.
- 축적된 이상 현상 기록(Lore)이 특정 기준을 만족하면, RAG에 의해 고유한 **개체 번호와 Object Class**를 부여받아 공식적으로 '재단(컨셉)의 관리 대상'으로 분류됨.
- Lore 축적은 펫의 능력치 변화, 새로운 변칙성 발현, 등급 상승 등에 직접적인 영향을 줌.

기능 개발 목록

ServerSide

- [x] API 명세서 (apiSpecitifation)
  - `swagger-jsdoc`와 `swagger-ui-express`를 통해 손수 작성
- [x] server.listen 정보 출력(동작한 서버의 Address, host 파악)
- [x] server 동작시 error 이벤트처리 (listen이 되지 않는 error상황에서의 정보 제공)
- [x] logger 설정 (morgan 및 winston으로 영구적인 서버이벤트 및 http request 정보 저징)
- [x] DB 연결 (pg를 통해 로컬 DB와연결 .env활용)
- [x] 초기 기능 구축

  - [x] routes 설정 (`router.get('/', userController.listUsers)`)
  - [x] controller 구현 (`listUsers`)
  - [x] service 구현 (`getAllUsers`)
  - [x] model 구현 (`findAllUsers`)
  - [x] routes 설정 (`router.post('/', userController.createUser)`)
  - [x] controller 구현 (`createUser`)
  - [x] service 구현 (`createUser`)
  - [x] model 구현 (`createUser`)

- [x] 세션 유지

  - 사용자 인증을 다시 입력하지 않게하고, 장바구니 등과 같은 커스텀 정보값을 유지하기 위해 설정 필요
  - 외부 세션저장 메모리를 쓰는것이 권장되지만 현재 단계에서는 간단하게 로컬서버에서 설정(서버가 내려가면 세션 정보 전부 사라짐짐)
  - 세션 지원 미들웨어인 `express-session`으로 구현
  - 클라이언트 쿠키는 session ID만 저장, 서버에서는 ID와 매핑되는 session의 프로퍼티들 저장

app-> routes -> controller-> service -> model-> DB
단계를 여러번 나누는 이유: 좀 더 복잡한 기능을 만들기위해 필요한 관심사 분리를 기반으로 아키텍처를 설계하고싶기에

## User 테이블 관련 기능 목록 정의

- DB 테이블: `users`
- 고려할 Columns (속성):
  - [x] `id`
    - **타입:** UUID 또는 INTEGER (DB 설정에 따라 선택. 고유 식별자)
    - **설명:** 사용자의 고유 ID (Primary Key)
    - **예시:** `a1b2c3d4-e5f6-7890-1234-567890abcdef`
  - [x] `username`
    - **타입:** VARCHAR
    - **설명:** 사용자 이름
    - **예시:** `"user123"`
  - [x] `email`
    - **타입:** VARCHAR
    - **설명:** 사용자 이메일
    - **예시:** `"user@example.com"`
  - [x] `password`
    - **타입:** VARCHAR
    - **설명:** 사용자 비밀번호 (암호화된 상태)
    - **예시:** `"encrypted_password"`
  - [x] `created_at`
    - **타입:** TIMESTAMP
    - **설명:** 사용자 생성 시간
    - **예시:** `2023-10-27T10:00:00Z`
  - [x] `updated_at`
    - **타입:** TIMESTAMP
    - **설명:** 사용자 정보가 마지막으로 업데이트된 시간
    - **예시:** `2023-10-27T11:30:00Z`
- [x] DB 생성 완료

## Pet 관련 기능 목록 정의

- [x] **GET /pets - 펫 목록 조회 API** 개발
- [x] **POST /pets - 신규 펫 생성 API** 개발
- [x] **GET /pets/:id - 펫 상세 조회 API** 개발
- [x] **GET /pets/owner/:ownerId - 소유자 펫 목록 조회 API** 개발
- [x] **DELETE /pets/:id - 펫 삭제 API** 개발

- User 테이블과의 관계: 1:N (1명의 유저가 여러 마리의 펫을 소유가능)
- DB 테이블: `pets` (예정)
- 고려할 Columns (속성):

  - [x] `id`
    - **타입:** UUID 또는 INTEGER (DB 설정에 따라 선택. 고유 식별자)
    - **설명:** 펫의 고유 ID (Primary Key)
    - **예시:** `a1b2c3d4-e5f6-7890-1234-567890abcdef`
  - [x] `assigned_number`
    - **타입:** VARCHAR
    - **설명:** RAG에 의해 부여된 SCP-like 개체 번호. 처음에는 NULL이며, Lore 축적 후 부여됨. (예: 'SCP-XXXX' 형식)
    - **예시:** `NULL` (초기), `???-?????-??`
  - [x] `name`
    - **타입:** STRING
    - **설명:** 유저가 설정한 펫의 이름
    - **예시:** `"Subject Delta"`
  - [x] `owner_id`
    - **타입:** UUID 또는 INTEGER (users 테이블의 id와 동일 타입. Foreign Key)
    - **설명:** 이 펫을 소유한 유저의 ID
    - **예시:** `user_id` (users 테이블 참조)
  - [x] `image_url`
    - **타입:** STRING
    - **설명:** 생성된 펫 이미지 파일의 URL 또는 경로
    - **예시:** `/images/pet/a1b2c3d4.png` 또는 `https://storage.com/.../a1b2c3d4.jpg`
  - [x] `description`
    - **타입:** TEXT (긴 문자열 저장용)
    - **설명:** 생성형 AI가 만들어낸 펫의 외형, 특징 등에 대한 텍스트 설명, 펫 이미지 생성시 활용할 프롬프트
    - **예시:** `"이 개체는 비늘로 덮인 작은 파충류 형태이며, 주변 환경의 소리를 모방하는 특성이 있다..."`
  - [x] `potential_class`
    - **타입:** STRING (또는 ENUM 타입)
    - **설명:** 펫 생성 시 가챠 시스템에 의해 부여된 초기 '변칙성 잠재력' 등급 (예: 'Minor', 'Standard', 'Significant'). 높을수록 초기 능력치나 잠재적 변칙성 발현에 유리할 수 있음.
    - **예시:** `"Standard"`
  - [x] `object_class`
    - **타입:** STRING (또는 ENUM 타입)
    - **설명:** 펫의 현재 격리 난이도 또는 위험도 등급 (예: 'Safe', 'Euclid', 'Keter'). Lore 축적 및 RAG 판단에 의해 부여/변경됨. 처음에는 NULL.
    - **예시:** `NULL` (초기), `"Euclid"`
  - [x] `anomaly_level`
    - **타입:** INTEGER 또는 FLOAT
    - **설명:** 펫의 '변이 레벨' 또는 '이상 현상 진척도'를 나타내는 내부 수치. Lore가 쌓일수록 증가하며, 번호/Object Class 부여 기준 등이 됨.
    - **예시:** `0` (초기), `55`
  - [x] `current_state`
    - **타입:** STRING (또는 ENUM 타입)
    - **설명:** 펫의 현재 활동 상태 (예: 'Idle', 'Exploring', 'Interacting', 'Resting', 'Contained').
    - **예시:** `"Idle"`
  - [x] `base_stats`
    - **타입:** JSONB
    - **설명:** 펫의 기본 능력치 모음 (예: 힘, 지능, 속도, 적응력 등). 초기 잠재력 클래스 및 Lore에 의해 영향받음.
    - **예시:** `{ "strength": 15, "intel": 20, "adaptability": 18 }`
  - [x] `current_status`
    - **타입:** JSONB
    - **설명:** 펫의 현재 일시적인 상태 모음 (예: 기분, 건강 상태, 현재 적용 중인 버프/디버프 등). 상호작용 결과에 따라 자주 변동.
    - **예시:** `{ "mood": "neutral", "health": "healthy", "effects": [] }`
  - [x] `lore`
    - **타입:** JSONB (배열 형태 추천)
    - **설명:** 펫이 겪은 사건, 달성한 업적, 특이 기록 등 '이상 현상 기록'들의 배열. 펫의 고유한 역사이자 성장의 핵심 근거. 각 기록은 텍스트 요약과 게임 로직에 필요한 구조적 데이터(효과, 타입 등)를 포함할 수 있음.
    - **예시:** `[]` (초기), `[ { "type": "achievement", "summary": "독 개체와의 전투 5연승 달성.", "timestamp": "..." }, { "type": "observation", "summary": "달빛 아래서 몸체가 희미하게 발광하는 현상 포착.", "timestamp": "..." } ]`
  - [x] `created_at`
    - **타입:** TIMESTAMP
    - **설명:** 펫이 생성된 시간 기록 (자동 생성)
    - **예시:** `2023-10-27T10:00:00Z`
  - [x] `updated_at`
    - **타입:** TIMESTAMP
    - **설명:** 펫 정보가 마지막으로 업데이트된 시간 기록 (자동 업데이트)
    - **예시:** `2023-10-27T11:30:00Z`

# 02 RAG, 세계 상호작용

Qdrant 사용(사용경험, 실시간 어플리케이션 성능 고려)

- [x] 콜렉션 셋업

## 02-1 RAG Collection Schema 관련

### 02-1-1 world_rules 컬렉션

- **목적:** SCP 세계관의 근본적인 규칙, 프로토콜, 이론, 개념 등 추상적이고 일반적인 지식을 저장합니다. 펫의 상호작용 결과나 LLM의 응답을 생성할 때 참조할 핵심적인 세계관 법칙을 제공합니다.
- **벡터:**
  - rule_embedding: 세계 규칙 텍스트 임베딩 벡터.
    - **크기:** <VECTOR_SIZE> (src/qdrant/collectionSetup.js 파일에서 설정된 임베딩 모델의 벡터 차원)
    - **거리:** <DISTANCE_METRIC> (src/qdrant/collectionSetup.js 파일에서 설정된 임베딩 모델의 권장 유사도 측정 방식)
- **페이로드 인덱스:**
  - category (keyword): 규칙 분류 (예: "Physics Rule", "Containment Protocol"). 필터링 성능 향상.
  - tags (keyword): 관련 키워드. 필터링 성능 향상.
  - related_entities (keyword): 이 규칙과 관련된 특정 엔티티 ID 배열 (named_entities 컬렉션 참조). 관련 엔티티 기반 필터링/검색 성능 향상.
  - text_content (text): (선택 사항) 원문 텍스트 검색용 인덱스. 텍스트 필드 검색 성능 향상.

### 02-1-2 named_entities 컬렉션

- **목적:** SCP 세계관 내 특정 존재(SCP 개체, 인물), 아이템, 장소 등의 구체적인 정보를 저장합니다. world_rules 컬렉션에서 참조될 수 있는 구체적인 엔티티 정보를 제공합니다.
- **벡터:**
  - entity_embedding: 엔티티 설명 텍스트 임베딩 벡터.
    - **크기:** <VECTOR_SIZE> (src/qdrant/collectionSetup.js 파일에서 설정된 임베딩 모델의 벡터 차원)
    - **거리:** <DISTANCE_METRIC> (src/qdrant/collectionSetup.js 파일에서 설정된 임베딩 모델의 권장 유사도 측정 방식)
- **페이로드 인덱스:**
  - name (text): 엔티티 이름 (예: "SCP-173", "Dr. Bright"). 이름 기반 검색 성능 향상.
  - assigned_number (keyword): (주로 SCP 개체) 할당된 번호 (예: "SCP-173"). 정확한 번호 매칭 필터링 성능 향상.
  - object_class (keyword): (주로 SCP 개체) 격리 등급 (예: "Safe", "Euclid", "Keter"). 등급별 필터링 성능 향상.
  - category (keyword): 엔티티 종류 (예: "Anomaly", "Person", "Location", "Item"). 종류별 필터링 성능 향상.
  - tags (keyword): 관련 키워드. 필터링 성능 향상.
  - description_summary (text): (선택 사항) 설명 요약 텍스트 검색용 인덱스. 텍스트 필드 검색 성능 향상.

### 02-1-3 pet_lore 컬렉션 (선택 사항)

- **목적:** 각 사용자 펫의 고유한 이상 현상 기록을 저장합니다. 펫의 경험 기반 Lore 축적 및 RAG에 활용됩니다.
- **벡터:**
  - lore_embedding: Lore 텍스트 임베딩 벡터.
    - **크기:** <VECTOR_SIZE> (src/qdrant/collectionSetup.js 파일에서 설정된 임베딩 모델의 벡터 차원)
    - **거리:** <DISTANCE_METRIC> (src/qdrant/collectionSetup.js 파일에서 설정된 임베딩 모델의 권장 유사도 측정 방식)
- **페이로드 인덱스:**
  - pet_id (keyword): 이 Lore가 속한 펫의 ID. 펫별 Lore 필터링/검색에 필수적이며 성능 향상.
  - type (keyword): Lore의 종류 (예: "achievement", "observation", "interaction_result"). 종류별 필터링 성능 향상.
  - timestamp (integer): Lore 발생 시간. 시간 기반 검색/정렬 성능 향상.
  - involved_entities (keyword): (선택 사항) 이 Lore에 연관된 엔티티 ID 배열. 연관 엔티티 기반 필터링/검색 성능 향상.
  - summary (text): (선택 사항) Lore 요약 텍스트 검색용 인덱스. 텍스트 필드 검색 성능 향상.
- [ ] RAG Knowledge Base 설계 및 구축

  - 서비스 세계관의 법칙, 물리/개념적 규칙, 특정 지역/아이템/존재의 특성, 카르마 시스템 규칙, 변칙성 상호작용 결과 로직, Lore 축적 조건 및 효과 등을 정의.
  - AI가 펫 생성, 상호작용 시뮬레이션, Lore 생성, 번호/등급 부여 등에 참조할 데이터 구축.

- [ ] 변칙성 상호작용 / 시뮬레이션 기능

  - 다른 유저의 펫 또는 NPC 펫과 '변칙성' 기반의 상호작용 시뮬레이션 실행.
  - RAG에 정의된 세계 규칙 및 두 펫의 변칙성을 기반으로 결과 도출 및 **Lore 축적**. (단순 전투 승패를 넘어선 다양한 결과 가능)

- [ ] 영향력 / 등급 기반 랭킹 시스템

  - 펫이 쌓은 이상 현상 기록(Lore)이나 특정 시뮬레이션 결과 등을 기반으로 펫의 '영향력' 또는 '위협 등급'을 산정하고 랭킹화. (TextBattle의 ELO/리그와 유사한 경쟁 요소)

- [] 소셜 로그인
  - (우선순위 낮음) 사용자를 식별하고 세션을 유지하기 위한 인증 수단.
  - 일반 회원 로그인 대신 더 나은 UX 경험을 위해 Google,X (Twitter)로그인 제공하기. 사용자 고려해서 요청이 많은 경우 추가 소셜로그인 방식 도입

## 02-2 어떤 임베딩 모델을 사용해야할까?

가격, 정확성, 추론속도, 확장성(multilingual)을 고려해서 선택하여야하는 부분입니다.
특히 콜렉션에서 벡터의 크기는 고정되기에 임베딩 모델마다 벡터차원의 크기가 다르기에 계획적으로 고민해야하는 부분입니다.
EMbedding model [리더보드](https://huggingface.co/spaces/mteb/leaderboard)(2025년4월기준)에서 확인하였습니다. 고민 포인트에서 만약 API로 가능하다면 사용하는 것이 운영관리에서 좋다고 생각했습니다. 일반적으로 좋은 성능의 Embedding모델을 동작시키기위해서 높은 GPU자원을 소모하고, 매번 추론할떄마다 소모되고 하다보니 이런 인프라적인 부담은 외부의 기능을 사용하는것이 결론적으로는 비용을(시간+금전)아끼는 방법이라 생각했습니다.

google의 `gemini-embedding-exp-03-07` 모델이 SOTA모델급에 가격이 전 모델 [text-004](https://ai.google.dev/gemini-api/docs/pricing#text-embedding-004)기준으로 무료로 제공되며, 프로덕션 환경에서 사용되는 [textembedding-gecko@001]의 경우(https://cloud.google.com/vertex-ai/generative-ai/pricing)

- input 0.025$/1M
- output No charge
  충분히 합리적이기에 해당 모델을 사용하기로했습니다.
  기본 3K임베딩에 config 설정을통해 1536, 768차원을 지원하는 점도 장점이었습니다.

## 02-2+1 임베딩 모델 수정할 필요가 발생

`gemini-embedding-exp-03-07`의 가격이 전면 무료이며, 성능이 충분히 SOTA에 가깝다는 평이 많아서 사용을 하려고했는데, 검색 결과 유저들도 비슷하게 가격을 찾기 힘든 것임을 확인하는 과정에서 분당 10번의(RPM) 제한 사항 발견.
가장 높은 티어도 [분당 10번의 제한](https://www.reddit.com/r/singularity/comments/1j5xtkm/stateoftheart_text_embedding_via_the_gemini_api/)이라는 치명적인 제한이 존재함

프리티어의 경우 심지어 5번이 한계!
https://ai.google.dev/gemini-api/docs/rate-limits#current-rate-limits

이런 한계점을 발견했기에 임베딩 모델 수정하기로 결정
모델 수정
https://huggingface.co/intfloat/multilingual-e5-large-instruct
종합적인 instruct 제공시 성능이 올라가는 560M규모의 작다고 판단되는 오픈 소스 모델

## TEI Docker 방식으로 임베딩 모델 서빙하기

오픈 소스 모델을 로컬 서버에서 동작을 하고싶은 상황. 유료 API를 사용하지 않고 로컬에서 안전하고 빠르게 요청하는 것이 목적. 하지만 이 경우 서버를 따로 만들어서 유지가 필요한데, 관리를 위한 비용을 최소화하고 싶은 상황

---

# 디렉토리 구조

```
.
|-- README.md
|-- babel.config.json
|-- config
|   |-- apiSpecification.js
|   |-- database.js
|   |-- logger.js
|   |-- qdrantClient.js
|   `-- session.js
|-- docker-compose.yml
|-- logs
|   `-- app.log
|-- migrations
|   |-- 1745056370599_create-pets-table.sql
|   |-- 1745246313455_add-addtional-columns.sql
|   `-- 1745327148556_create-user-table.sql
|-- observeSpecificError.js
|-- package-lock.json
|-- package.json
|-- public
|-- src
|   |-- api
|   |   `-- users
|   |-- app.js
|   |-- controllers
|   |   |-- petController.js
|   |   `-- userController.js
|   |-- models
|   |   |-- petModel.js
|   |   `-- userModel.js
|   |-- qdrant
|   |   `-- collectionSetup.js
|   |-- routes
|   |   |-- petRouters.js
|   |   |-- rootRoutes.js
|   |   `-- userRoutes.js
|   |-- services
|   |   |-- petService.js
|   |   `-- userService.js
|   `-- utils
|       `-- loggerUtils.js
`-- test
    |-- __test__
    `-- script
        |-- geminiapi.js
        |-- run-model-test.js
        `-- test_TEI.js
```

## 유틸리티 기능

### 로깅 유틸리티 (loggerUtils.js)

- [x] `logAndExecute` - 비즈니스 로직 래핑 함수

  - 비동기 비즈니스 로직 함수를 실행하고 시작/완료/실패 로깅을 자동화
  - 서비스, 컨트롤러 등에서 재사용 가능한 로깅 패턴 제공
  - 에러 발생 시 자동 로깅 및 에러 전파

- [x] `wrapControllerHandler` - 컨트롤러 핸들러 래핑 함수
  - Express 컨트롤러 핸들러에 대한 자동 로깅 기능
  - try-catch 패턴과 에러 핸들링 자동화
  - 요청 method와 path 정보 포함한 상세 로깅

## 아키텍처 패턴

- **레이어드 아키텍처** 채택

  - Controller → Service → Model 패턴으로 관심사 분리
  - 각 레이어는 단일 책임을 가지며 명확한 의존성 방향 유지

- **유틸리티 레이어**

  - 공통 기능을 재사용 가능한 유틸리티로 분리
  - 로깅, 에러 핸들링 등 크로스커팅 관심사를 중앙화

- **설정 분리**
  - 데이터베이스, 로깅, 세션 등 설정을 별도 파일로 분리
  - 환경별 설정 관리 용이

# DDL 작업은 migration에서 수행

테이블의 생성, 스키마의 변경등의 작업은 model이 아닌 버전관리를 위해 migration디렉토리의 `node-pg-migrate`를 통해 수행
데이터에 대한 CRUD만 `pg`로 수행

#### Prisma대신 pg 사용하는 이유

-> ORM 학습을 위해 Prisma 시도 schema생성 및 Prisma Client까지 생성 후 테스트해봄
-> Prisma검색결과 2배에서 많게는 5배까지 퍼포먼스차이가나며, ORM만 쓰기에 쿼리튜닝이나 오버헤드 등으로DB 학습에는 부적합하다고판단
-> pg로 사용하기로 결정

## 고민 어떤 migration 툴을 사용해야하는가?

테이블의 생성, 스키마의 관리를 위해 툴을 정해야하는데 처음에는 `node-pg-migrate`만 고려했다가 다른 옵션이이있는지 탐색.
검색 결과 무수히 많은 옵션,장점,단점이있음을 확인인

#### [레딧 유저의 ORM없이 어떤 migration툴을 사용하는지에대한 쓰레드](https://www.reddit.com/r/node/comments/18gktjm/what_do_you_use_for_sql_db_migrations/)

가장 자주 언급된 툴들

- `Knex`: SQL 쿼리 빌더이지만 마이그레이션 기능도 많이 사용됩니다.
- `node-pg-migrate`: 특히 PostgreSQL 사용자들에게 언급되며, "straightforward(직관적이고 단순함)"하다는 긍정적인 평가가 있습니다.
- `Dbmate`: 사용하기 좋고, 다른 대안들과 비교표를 제공한다는 점이 언급되었습니다.
- `Flyway` / `Liquibase`: 언어나 프레임워크에 구애받지 않는 범용적인 데이터베이스 마이그레이션 도구들로, 특히 Flyway는 "no complaints(불만 없음)"이라는 의견이 있었습니다.
- `Graphile Migrate`: PostgreSQL에 초점을 맞춘 또 다른 도구로 언급되었습니다.

ORM 도구의 마이그레이션 기능만 사용

- Prisma나 TypeORM과 같은 ORM의 쿼리 빌더 기능은 사용하지 않더라도, 해당 ORM이 제공하는 마이그레이션 시스템만 별도로 사용하는 경우도 있다는 의견이 있었습니다.
- Prisma의 경우 스키마 관리 및 제너레이터를 통한 타입 생성 등에 유용하다는 의견이 있습니다.

> 결론은 `node-pg-migrate`이 가지는 장점(안정성, PostgreSQL 특화, SQL 친화성,관리하기 편함)이 큼으로 해당 툴 사용

## ORM을 사용해도되는가?의 고민

https://www.reddit.com/r/node/comments/1cgr49k/when_does_it_make_sense_to_use_an_orm/
결론적으로는 학습겸 성능까지 고려해서 sql기반의 간단한 `pg`사용하기로함. ORM툴의 경우 의존성 복잡성도 크고하니깐

# 프로젝트 아키텍처 변경사항

## Test DB 설계

새로만든 createPet 데이터 함수를 테스트하기위해 Jest로 단위테스트를 하는 것에 오버헤드가 크다고 느껴서 실제E2E를 최대한 간단하고 빠르게 구현하기 위해 동일한 schema를 가지는 테스트 DB를 만들어서 테스트하기로 결정

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

# SQL관련

### uuid 생성 함수

[`gen_random_uuid()`](https://www.postgresql.org/docs/current/functions-uuid.html): uuid v4 자동 생성함수. 13버전 이후부터 PostgreSQL에 자동 내장

### node-pg-migration Not run migration Error

```
dotenv -e .env -- node-pg-migrate up
Error: Not run migration 1745056370599_create-pets-table is preceding already run migration 0001_set-updatedAt-default

```

migrate 명령마다 `pgmigrations`에 기록이 저장되는데, 해당 파일을 본인이 삭제하여 불일치 한다고 나오는 경우. 해당파일을 복구하여 파일 순서를 복구하는 방법이 권장되나 아예 사용하지 않을 테이블이기에 수동으로 삭제 수행

` DELETE FROM pgmigrations WHERE name = '0001_set-updatedAt-default';`

### JSON, JSONB 데이터 타입의 차이

JSON: 데이터를 조회할 때마다 **파싱(parsing)**하여 JSON 구조로 해석해야 합니다.

- 읽기 및 검색/쿼리: 데이터를 읽거나 JSON 구조 내부의 특정 키/값을 검색, 조작할 때마다 파싱 과정이 필요하므로 JSONB보다 느립니다.
- 쓰기: **JSONB보다 빠를 수 있습니다.** 문자열 그대로 저장하면 되기 때문에 추가적인 처리 부담이 적습니다.

JSONB: 입력된 JSON 데이터를 파싱하여 이진(binary) 형태로 저장합니다. 저장 시 공백은 제거되고, 키의 순서는 정렬되며, 중복된 키가 있다면 마지막 키만 남습니다.

- 읽기 및 검색/쿼리: 이미 이진 형태로 저장되어 있어 파싱 과정이 생략되므로 **JSON보다 훨씬 빠릅니다.**
- 쓰기: 저장 시 파싱 과정이 필요하므로 JSON보다 느릴 수 있습니다.

### pg-query Promise result 객체 schema

```
interface QueryResult<RowType = any> {
  command: string; // 실행된 SQL 명령어 (예: 'SELECT', 'INSERT', 'UPDATE', 'DELETE')
  rowCount: number; // 영향을 받은 행의 수 (SELECT는 결과 행의 수, INSERT/UPDATE/DELETE는 변경된 행의 수)
  oid: number | null; // INSERT 시 생성된 OID (일반적으로 사용되지 않으며 null일 경우가 많음)
  rows: RowType[]; // 쿼리 결과 데이터의 배열 (SELECT 쿼리에서만 데이터가 담기며, INSERT/UPDATE/DELETE는 보통 빈 배열 [])
  fields: FieldDef[]; // 결과 컬럼들의 메타데이터 (컬럼 이름, 타입 정보 등)
  // 기타 내부 속성들 (대개 개발자가 직접 사용하지 않음)
}

interface FieldDef {
  name: string; // 컬럼 이름
  tableID: number; // 컬럼이 속한 테이블의 OID
  columnID: number; // 테이블 내에서 컬럼의 위치 (0부터 시작)
  dataTypeID: number; // PostgreSQL 데이터 타입 OID
  // 기타 타입 관련 정보 (typeModifier, format)
}
```

# API

## API 경로 설계를 잘못한 경우(경로 설정)

`Express.js`에서는 위에서부터 아래로 읽기 때문에 해당되는 경우 수행하고 종료됨으로 :ownerId 경로의 함수는 항상 실행이 안됨.

```
router.get("/:id", async (req, res, next) => {
  logger.info(`GET /pets/:id  called`);
  petController.findPetById(req, res, next);
});

router.get("/:ownerId", async (req, res, next) => {
  logger.info(`GET /pets/:ownerId  called`);
  petController.findPetsByOwnerId(req, res, next);
});

```

## API 명세서 작성하기

API 개수가 늘어나면서 어떤 경로에 어떤 method가 있는지 명확하게 관리하기 위해 명세서가 필요하게 됐습니다.
FastAPI의 경우 자동으로 API 명세서가 만들어지는 점을 참고하여 자동으로 경로에 따른 명세서를 만들어주는 패키지를 먼저 찾아보았습니다.

검색을 통해 먼저 **Express.js에 쉽게 명세서를 자동으로 만들어주는 패키지는 없다** 는 것을 파악했습니다.

그래도 사용되는 패키지 중 하나인 `swagger-autogen`을 설치하여 테스트해봤습니다.
하지만 문제가 생긴 부분은 app.use + router를 사용하다보니 fullPath가 제대로 출력되지 않는 문제가 생겼습니다.

그래서 http request의 헤더와 페이로드를 이용해 명세서를 작성하는 `express-oas-generator`패키지를 찾아서 사용했습니다.
하지만 해당 패키지는 버전 호환성 문제로 작동하지 않았습니다.
코드를 설정할 경우 `express-list-endpoints`에서 stack이 undefined값임으로 에러가 발생했습니다. 그래서 `express-list-endpoints`의 소스값을 확인하였지만 원인을 알기는 어려웠습니다. 그러다 해당 패키지를 웹에서 확인해본 결과 **express 4만 지원** 이라는 제약사항이 있었습니다(현재 서버는 express5.1)
그래서 이 패키지를 위해서 서버의 버전을 바꾸는 것은 적합하지 않고, 버전 다운그레이드이기 때문에 해당 패키지 방식도 포기하였습니다.

마지막으로 남은것이 자동이 아닌 수동으로 `swagger-jsdoc` 로 OpenAPI에 맞춰 작성한 후 자동으로 `api-docs`경로로 생성해주는 `swagger-ui-express`를 조합하는 방법을 사용하였습니다. 명세서 관리를 위해 일일히 수동으로 전부 적어줘야하는 방법이기에 최대한 피할려고했지만, 현재로서 가능한 방법은 이 방법이 그나마 가장 쉬운 방법이라 생각했습니다.(이 기능을 위해 따로 기능을 만드는 것은 우선순위가 낮으니...)

결론적으로 최소한의 값을 이용해 AI를 통해 문법을 익혀가며 구현을 완료하였습니다.
`apiSpecification.js`파일을 작성한후 routes밑의 파일에 전부 작성하는 방법으로 docs를 구현했습니다.


## transaction 구현

어떤 기능을 transcation으로 만들 것인가?
단순한 한번의 쿼리로는 해결하기 어려운 복잡한기능 + ACID가 반드시 필요한 기능 단위

1. 펫을 생성
2. 유저정보 업데이트