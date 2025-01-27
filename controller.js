const endpoints = require("./endpoints.json");
const { selectTopics } = require("./model");

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
