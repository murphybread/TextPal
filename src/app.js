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
  const addressInfo = server.address();
  console.log(addressInfo);
});
