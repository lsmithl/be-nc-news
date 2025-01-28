const endpoints = require("./endpoints.json");
const { selectTopics, selectArticlesById } = require("./model.js");

exports.getEndpoints = (req, res) => {
  res.send({ endpoints });
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.send({ topics });
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
