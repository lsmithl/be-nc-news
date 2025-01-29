const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("nc_news", () => {
  describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toEqual(endpointsJson);
        });
    });
  });
  describe("GET /api/topics", () => {
    test("200: Responds with an object containing an array of all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBe(3);
          topics.forEach((element) => {
            expect(element).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
  describe("GET /api/articles", () => {
    test("200: Responds with an object containing an array of all articles, sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
            expect(article.body).toBeUndefined();
          });
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("200: Responds with an article object of the specified ID", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    test('400: Responds with message "Bad Request" if the request parameter is not a number', () => {
      return request(app)
        .get("/api/articles/ten")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test('404: Responds with message "Not Found" if the ID doesn\'t exist', () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: Responds with an object containing an array of all comments of the article with the specified ID, sorted by most recent", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            });
          });
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("200: Responds with an object containing an empty array if the article exists but has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    test('400: Responds with message "Bad Request" if the request parameter is not a number', () => {
      return request(app)
        .get("/api/articles/ten/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test('404: Responds with message "Not Found" if the ID doesn\'t exist', () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("201: Responds with an object containing the sucessfully posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "I'm only commenting for the algorithm.",
          author: "icellusedkars",
        })
        .expect(201)
        .then(({ body: { newComment } }) => {
          expect(newComment).toMatchObject({
            comment_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            author: "icellusedkars",
            body: "I'm only commenting for the algorithm.",
            article_id: 1,
          });
        });
    });
    test('400: Responds with message "Bad Request" if the request parameter is not a number', () => {
      return request(app)
        .post("/api/articles/ten/comments")
        .send({
          body: "Hmm, does this work?",
          author: "icellusedkars",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test('400: Responds with message "Bad Request" if the posted body does not contain the correct fields', () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          comment: "Is this the right way to to make a comment? :/",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test('401: Responds with message "Unregistered User" if the request is not from a registered user', () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "I'm posting a comment but I don't have an account! yay!",
          author: "unregistered_hyperuser",
        })
        .expect(401)
        .then(({ body }) => {
          expect(body.msg).toBe("Unregistered User");
        });
    });
    test('404: Responds with message "Not Found" if the article ID doesn\'t exist', () => {
      return request(app)
        .post("/api/articles/9999/comments")
        .send({
          body: "What happens if I do this?",
          author: "icellusedkars",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("200: Responds with an object containing the sucessfully updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { updatedArticle } }) => {
          expect(updatedArticle).toMatchObject({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 101,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test('400: Responds with message "Bad Request" if the request parameter is not a number', () => {
      return request(app)
        .patch("/api/articles/ten")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test('400: Responds with message "Bad Request" if the body does not contain the correct fields', () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ something_which_isnt_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test('400: Responds with message "Bad Request" if the body contains the correct fields but the wrong data type', () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "Five" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test('404: Responds with message "Not Found" if the article ID doesn\'t exist', () => {
      return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("204: Responds with no content and deletes the specified comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return db
            .query(`SELECT * FROM comments WHERE comment_id = 1;`)
            .then(({ rows }) => {
              expect(rows.length).toBe(0);
            });
        });
    });
    test('400: Responds with message "Bad Request" if the request parameter is not a number', () => {
      return request(app)
        .delete("/api/comments/ten")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test('404: Responds with message "Not Found" if the comment ID doesn\'t exist', () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });

  describe("ALL /* any URL or method which has not been defined as an endpoint", () => {
    test('404: Responds with message "Not Found" ', () => {
      return request(app)
        .get("/badURL")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});
