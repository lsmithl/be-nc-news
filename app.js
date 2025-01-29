const express = require("express");
const app = express();

const {
  getEndpoints,
  getTopics,
  getArticlesById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleVotesByArticleId,
  deleteCommentByCommentId,
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

app.use(express.json());

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.all("/*", badUrl);

app.use(sqlError);
app.use(customError);
app.use(serverError);

module.exports = app;
