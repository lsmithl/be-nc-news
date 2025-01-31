const db = require("./db/connection.js");

exports.selectUsers = () => {
  return db.query(`TABLE users;`).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    } else {
      return rows;
    }
  });
};

exports.selectTopics = () => {
  return db.query(`TABLE topics;`).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    } else {
      return rows;
    }
  });
};

exports.selectArticles = ({
  sort_by = "created_at",
  order = "desc",
  topic = "*",
}) => {
  const validSortColumns = [
    "created_at",
    "article_id",
    "author",
    "comment_count",
    "title",
    "topic",
    "votes",
  ];
  const validSortOrders = ["desc", "asc"];

  if (!validSortColumns.includes(sort_by) || !validSortOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

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
      WHERE ${topic !== "*" ? "articles.topic = $1" : "$1 = $1"}
      GROUP BY articles.article_id
      ORDER BY ${
        sort_by === "comment_count"
          ? "COUNT(comments.article_id)"
          : "articles." + sort_by
      } ${order};`,
      [topic]
    )
    .then(({ rows }) => rows);
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

exports.updateArticleVotesByArticleId = ({ article_id }, body) => {
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $2
      WHERE article_id = $1
      RETURNING *;`,
      [article_id, body.inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return rows[0];
      }
    });
};

exports.removeCommentByCommentId = ({ comment_id }) => {
  return db
    .query(
      `SELECT comment_id FROM comments
      WHERE comment_id = $1;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return db.query(
          `DELETE FROM comments
          WHERE comment_id = $1;`,
          [comment_id]
        );
      }
    });
};
