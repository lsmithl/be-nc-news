const { objectToLowerCase } = require("./utils/appUtils.js");
const endpoints = require("./endpoints.json");
const {
  selectTopics,
  selectArticlesById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleVotesByArticleId,
  removeCommentByCommentId,
  selectUsers,
} = require("./model.js");

exports.getEndpoints = (req, res) => {
  res.send({ endpoints });
};

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.send({ users });
  });
};

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.send({ topics });
  });
};

exports.getArticles = (req, res, next) => {
  selectArticles(objectToLowerCase(req.query))
    .then((articles) => {
      res.send({ articles });
    })
    .catch((err) => {
      next(err);
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

exports.postCommentByArticleId = (req, res, next) => {
  insertCommentByArticleId(req.params, req.body)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotesByArticleId = (req, res, next) => {
  updateArticleVotesByArticleId(req.params, req.body)
    .then((updatedArticle) => {
      res.send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByCommentId = (req, res, next) => {
  removeCommentByCommentId(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
