const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/microservice 1", createProxyMiddleware({
  target: "http://localhost:5001",
  changeOrigin: true
}));

app.use("/microservice 2", createProxyMiddleware({
  target: "http://localhost:5002",
  changeOrigin: true
}));

app.use("/microservice 3", createProxyMiddleware({
  target: "http://localhost:5003",
  changeOrigin: true
}));

app.use("/microservice 4", createProxyMiddleware({
  target: "http://localhost:5004",
  changeOrigin: true
}));

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});