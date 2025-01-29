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

exports.selectArticles = () => {
  return db
    .query(
      `SELECT
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.article_id) :: INTEGER AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return rows;
      }
    });
};

exports.selectArticlesById = ({ article_id }) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
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

exports.selectCommentsByArticleId = ({ article_id }) => {
  return db
    .query(
      `SELECT * FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return db
          .query(
            `SELECT article_id FROM articles
            WHERE article_id = $1;`,
            [article_id]
          )
          .then(({ rows }) => {
            if (rows.length === 0) {
              return Promise.reject({ status: 404, msg: "Not Found" });
            } else {
              return [];
            }
          });
      } else {
        return rows;
      }
    });
};

exports.insertCommentByArticleId = ({ article_id }, comment) => {
  return db
    .query(
      `INSERT INTO comments (article_id, body, author)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [article_id, comment.body, comment.author]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
