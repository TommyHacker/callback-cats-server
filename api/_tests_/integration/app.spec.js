const request = require("supertest");
const app = require("../../app");
const port = 5000;
let api;

const { connectDB, disconnectDB } = require("../../database");

describe("api endpoints", () => {
  beforeAll(async () => {
    await connectDB();
  });
  beforeEach(async () => {
    api = app.listen(port, () => console.log(`test server port:${port}`));
  });
  afterEach(async () => {
    await api.close();
  });
  afterAll(async () => {
    await disconnectDB();
  });

  describe("GET root route endpoint", () => {
    test("should return statusCode 200", async () => {
      const res = await request(api).get("/");
      expect(res.statusCode).toBeTruthy();
    });
    test("should return message ----", async () => {
      const res = await request(api).get("/");
      expect(res.body.message).toBe("api success.");
    });
    test("should return success in body", async () => {
      const res = await request(api).get("/");
      expect(res.body.success).toBe(true);
    });
  });




});
