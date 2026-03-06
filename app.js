const express = require("express");
const client = require("prom-client");

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

app.get("/", (req, res) => res.send("CI/CD demo running"));

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => console.log("Listening on 3000"));
