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
});
