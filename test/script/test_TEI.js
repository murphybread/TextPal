async function getEmbeddingsFromTEI(texts, areQueries = []) {
  // areQueries 기본값을 빈 배열로 설정
  const teiServerUrl = "http://localhost:8080/embed";

  // 실제 사용 사례에 맞는 작업 설명 정의
  const taskDescriptionForQueries = "Retrieve relevant passages from the knowledge base for the given query.";

  const processedTexts = texts.map((text, index) => {
    // areQueries 배열이 제공되었고, 현재 인덱스의 값이 true이면 Query로 처리
    if (areQueries.length === texts.length && areQueries[index]) {
      return `Instruct: ${taskDescriptionForQueries}\nQuery: ${text}`;
    }
    return text; // 그 외에는 Document로 처리 (프리픽스 없음)
  });

  const payload = {
    inputs: processedTexts,
    normalize: true, // 임베딩 정규화
    truncate: true, // 최대 길이에 맞춰 자르기
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
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}, body: ${errorBody}`);
    }

    const embeddings = await response.json();
    return embeddings;
  } catch (error) {
    console.error("Error fetching embeddings from TEI server:", error);
    return null;
  }
}
// 테스트 실행
async function runTest() {
  const sampleQueries = ["intfloat/multilingual-e5-large-instruct 모델 테스트 중입니다."];
  const sampleDocuments = ["This is a test sentence for TextPal.", "你好，世界！"];

  const allTexts = [...sampleQueries, ...sampleDocuments];
  const areTheseQueries = [...Array(sampleQueries.length).fill(true), ...Array(sampleDocuments.length).fill(false)];

  console.log(`Requesting embeddings for ${allTexts.length} texts...`);
  const embeddingsArray = await getEmbeddingsFromTEI(allTexts, areTheseQueries);

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
