const request = require("supertest");
const app = require("../../app");
const port = 5000;
let api;

const { connectDB, disconnectDB } = require("../../database");

describe("api endpoints", () => {
  beforeAll(() => {
    connectDB();
  });
  beforeEach(async () => {
    api = app.listen(port, () => console.log(`test server port:${port}`));
  });
  afterEach(async () => {
    await api.close();
  });
  afterAll(() => {
    disconnectDB();
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

  describe("POST /Users should create a new username", () => {
    test("should respond with a new user created.", async () => {
      const res = await request(app)
        .post("/users/")
        .send({ username: "tommy hacker" });
      expect(res.body.success).toBeTruthy();
      expect(res.body.message).toBe("user created successfully.");
      expect(res.body.data).toBeTruthy();
    });

    test("should error if no username provided for new user", async () => {
      const res = await request(app).post("/users/").send({ username: null });
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("something went wrong.");
    });

    test("should find and return user by id", async () => {
      const mockUser = await request(app)
        .post("/users/")
        .send({ username: "tommy hacker" });
      const id = await mockUser._body.data._id;
      const res = await request(app).get(`/users/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe("tommy hacker");
    });
    test("should return no user found with invalid id", async () => {
      const res = await request(app).get("/users/123");
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("problem while finding user by id.");
    });

    test("should return success for deleting user", async () => {
      const mockUser = await request(app)
        .post("/users/")
        .send({ username: "tommy hacker" });
      const id = await mockUser._body.data._id;

      const res = await request(app).delete(`/users/${id}`);
      expect(res.statusCode).toBe(204);
    });
    test("should return error if deleteuser.id not found", async () => {
      const res = await request(app).delete("/users/123");
      expect(res.statusCode).toBe(404)
    })
  });
});
