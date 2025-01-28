const db = require("./db/connection.js");

exports.selectTopics = () => {
  return db.query(`TABLE topics;`).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    } else {
      return rows;
    }
  });
};

exports.selectArticlesById = ({ article_id }) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else if (rows.length > 1) {
        return Promise.reject({ status: 500, msg: "Server Error" });
      } else {
        return rows[0];
      }
    });
};
