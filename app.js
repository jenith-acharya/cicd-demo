const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("CI/CD demo running"));
app.listen(3000, () => console.log("Listening on 3000"));
