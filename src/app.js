import express from "express";

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const HOST = process.env.HOST || "localhost";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = app.listen(SERVER_PORT, HOST);

server.on("listening", () => {
  try {
    const addressInfo = server.address();
    if (addressInfo) {
      const bindAddress = addressInfo.address;
      const bindPort = addressInfo.port;

      console.log("✅ 서버 리스닝 성공!");
      console.log(`   - 주소: ${bindAddress}`);
      console.log(`   - 포트: ${bindPort}`);
      console.log(`   - 접속 URL (로컬): http://${bindAddress === "::1" || bindAddress === "127.0.0.1" ? "localhost" : bindAddress}:${bindPort}`);
    } else {
      console.error("Error: Unable to retrieve address information.");
    }
  } catch (error) {
    console.error("Error occurred while starting the server:", error);
  }
});
