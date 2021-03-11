const request = require("supertest");
const app = require("../../server");
describe("Update loan", () => {
  test("should update a loan", async (done) => {
    const res = await request(app).post("/api/loan/update").send({
      referenceId: "C45D-0804",
      status: "success",
    });
    expect(res.body).toHaveProperty("success");
    done();
  });
});
