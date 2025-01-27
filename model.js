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
