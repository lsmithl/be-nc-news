exports.badUrl = (req, res) => {
  res.status(404).send({ msg: "Not Found" });
};

exports.sqlError = (err, req, res, next) => {
  if (/22P02|23502/.test(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.constraint === "comments_author_fkey") {
    res.status(401).send({ msg: "Unregistered User" });
  } else if (/23503/.test(err.code)) {
    res.status(404).send({ msg: "Not Found" });
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
