const http = require("node:http");
const PORT = 1234;
const server = http.createServer((req, res) => {
  if (req.url === "/v1/models") {
    const body = JSON.stringify({ models: [{ id: "qwen3-coder-30b" }] });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(body);
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Test server listening on http://0.0.0.0:${PORT}`);
});
