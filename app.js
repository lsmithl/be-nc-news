const express = require("express");
const app = express();
const cors = require("cors");

const {
  getEndpoints,
  getTopics,
  getArticlesById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleVotesByArticleId,
  deleteCommentByCommentId,
  getUsers,
  patchCommentVotesByCommentId,
} = require("./controller.js");
const {
  sqlError,
  customError,
  serverError,
  badUrl,
} = require("./error-handler.js");

app.use(cors());

app.get("/api", getEndpoints);

app.get("/api/users", getUsers);

app.get("/api/topics", getTopics);

app.get("/api/articles/", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(express.json());

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotesByArticleId);

app.patch("/api/comments/:comment_id", patchCommentVotesByCommentId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.all("/*", badUrl);

app.use(sqlError);
app.use(customError);
app.use(serverError);

module.exports = app;
