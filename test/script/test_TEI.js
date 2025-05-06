// test_tei_embeddings.js

// Node.js 18 이상에서는 fetch가 기본적으로 사용 가능합니다.
// 이전 버전의 Node.js를 사용 중이라면, `node-fetch` 같은 라이브러리를 설치해야 할 수 있습니다.
// npm install node-fetch
// const fetch = require('node-fetch'); // node-fetch 사용 시

async function getEmbeddingsFromTEI(texts) {
  const teiServerUrl = "http://localhost:8080/embed";

  // intfloat/multilingual-e5-large-instruct 모델은 특정 작업(예: 검색)에서
  // "query: " 또는 "passage: " 같은 접두사를 텍스트 앞에 붙이면 더 좋은 성능을 낼 수 있습니다.
  // 일반적인 테스트에서는 접두사 없이 보내도 작동합니다.
  // 필요하다면 입력 텍스트를 다음과 같이 수정할 수 있습니다:
  // const prefixedTexts = texts.map(text => `query: ${text}`);

  const payload = {
    inputs: texts,
    normalize: false, // 정규화된 임베딩을 원하면 true로 설정
    truncate: false, // 모델의 최대 길이에 맞춰 입력을 자르려면 true로 설정
  };

  console.log("Request Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(teiServerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // 오류 내용을 확인하기 위해 text로 받음
      throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}, body: ${errorBody}`);
    }

    // TEI의 /embed 엔드포인트는 직접 임베딩 배열들의 배열을 반환합니다.
    const embeddings = await response.json();
    return embeddings;
  } catch (error) {
    console.error("Error fetching embeddings from TEI server:", error);
    return null;
  }
}

// 테스트 실행
async function runTest() {
  const sampleTexts = [
    "This is a test sentence for TextPal.",
    "你好，世界！", // 중국어
    "intfloat/multilingual-e5-large-instruct 모델 테스트 중입니다.", // 한국어
  ];

  console.log(`Requesting embeddings for ${sampleTexts.length} texts...`);
  const embeddingsArray = await getEmbeddingsFromTEI(sampleTexts);

  if (embeddingsArray && Array.isArray(embeddingsArray)) {
    console.log(`\nSuccessfully received ${embeddingsArray.length} embeddings.`);
    embeddingsArray.forEach((embedding, index) => {
      console.log(`\nEmbedding for text #${index + 1} ("${sampleTexts[index]}"):`);
      if (Array.isArray(embedding)) {
        console.log(`  Dimension: ${embedding.length}`);
        console.log(`  First 5 values: [${embedding.slice(0, 5).join(", ")}, ...]`);
      } else {
        console.log("  Received data is not an array:", embedding);
      }
    });
  } else {
    console.log("\nFailed to get embeddings or received unexpected format.");
  }
}

runTest();
