const request = require("supertest");
const app = require("../../server");
describe("New loan", () => {
  test("should create a new loan", async (done) => {
    const res = await request(app).post("/api/loan/create").send({
      dealerId: "C45D-0804",
      make: "Toyota",
      model: "Camry",
      year: "2010",
      amount: 1000000,
      provider: "EasyFinance",
      lotNumber: "NG-123456",
      narration: "Loan for Toyota Camry 2010",
    });

    expect(res.body).toHaveProperty("success");
    done();
  }, 30000);
});
