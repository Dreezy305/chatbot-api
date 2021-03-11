const request = require("supertest");
const app = require("../../server");
describe("Get loans", () => {
  test("should list loans", async (done) => {
    const res = await request(app).get("/api/loans?page=1&limit=50");
    expect(res.statusCode).toEqual(200);
    done();
  });
});
