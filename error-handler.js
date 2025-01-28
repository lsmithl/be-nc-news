exports.badUrl = (req, res) => {
  res.status(404).send({ msg: "Not Found" });
};

exports.sqlError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
