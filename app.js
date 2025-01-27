const express = require("express");
const app = express();

const { getEndpoints, getTopics } = require("./controller");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

module.exports = app;
