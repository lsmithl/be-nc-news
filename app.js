const express = require("express");
const app = express();

const {
  getEndpoints,
  getTopics,
  getArticlesById,
  getArticles,
  getCommentsByArticleId,
} = require("./controller");
const {
  sqlError,
  customError,
  serverError,
  badUrl,
} = require("./error-handler");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("/*", badUrl);

app.use(sqlError);
app.use(customError);
app.use(serverError);

module.exports = app;
