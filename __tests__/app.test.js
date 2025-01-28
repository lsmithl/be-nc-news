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
          expect(topics.length).toBeGreaterThan(0);
          topics.forEach((element) => {
            expect(element).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test('404: Responds with message "Not Found" if the topics table is empty', () => {
      return db
        .query(
          `DELETE FROM comments; DELETE FROM articles; DELETE FROM users; DELETE FROM topics;`
        )
        .then(() => {
          return request(app)
            .get("/api/topics")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not Found");
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
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
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

  describe("ALL /* any URL or method which has not been defined as an endpoint", () => {
    test('404: Responds with message "Not Found" ', () => {
      return request(app)
        .get("/badURL")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        })
        .then(() => {
          return request(app)
            .post("/api")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not Found");
            });
        })
        .then(() => {
          return request(app)
            .patch("/api")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not Found");
            });
        })
        .then(() => {
          return request(app)
            .delete("/api")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not Found");
            });
        });
    });
  });
});
