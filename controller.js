const endpoints = require("./endpoints.json");
const {
  selectTopics,
  selectArticlesById,
  selectArticles,
  selectCommentsByArticleId,
} = require("./model.js");

exports.getEndpoints = (req, res) => {
  res.send({ endpoints });
};

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.send({ topics });
  });
};

exports.getArticles = (req, res) => {
  selectArticles().then((articles) => {
    res.send({ articles });
  });
};

exports.getArticlesById = (req, res, next) => {
  selectArticlesById(req.params)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  selectCommentsByArticleId(req.params)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
