const request = require("supertest");
const app = require("../../server");
describe("Get single loan", () => {
  test("should get a loan", async (done) => {
    const res = await request(app).get("/api/loan/394933");
    expect(res.statusCode).toEqual(200);
    done();
  }, 30000);
});
