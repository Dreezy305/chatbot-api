const request = require("supertest");
const app = require("../../server");
describe("Get single wallet", () => {
  test("should get a wallet", async (done) => {
    const res = await request(app).get("/api/wallet/C45D-0804");
    expect(res.statusCode).toEqual(200);
    done();
  }, 30000);
});
