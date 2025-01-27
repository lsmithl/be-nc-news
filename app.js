const express = require("express");
const app = express();

const { getEndpoints, getTopics } = require("./controller");
const {
  sqlError,
  customError,
  serverError,
  badUrl,
} = require("./error-handler");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.all("/*", badUrl);

app.use(sqlError);
app.use(customError);
app.use(serverError);

module.exports = app;
