const endpoints = require("./endpoints.json");
const { selectTopics } = require("./model");

exports.getEndpoints = (req, res) => {
  res.send({ endpoints });
};

exports.getTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch(() => {
      res.status(404).send({ msg: "Not Found" });
    });
};
