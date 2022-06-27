const request = require("supertest");
const app = require("../../app");
const port = 5000;
const { decodeToken } = require("../../helpers/tokenHelpers");
let api;

const { connectDB, disconnectDB } = require("../../database");

describe("api endpoints", () => {
  beforeAll(async () => {
    await connectDB();
  });
  beforeEach(async () => {
    api = app.listen(port);
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
  describe("user routes with auth", () => {
    // CREATE / REGISTER USER
    test("should return user registered", async () => {
      const res = await request(app)
        .post("/users/register")
        .send({ username: "tom", password: "tom", email: "tom@tom.tom" });
      expect(res.body.message).toBe("User successfully created");
      expect(res.body.username).toBe("tom");
    });

    // LOGIN
    test("should log user in and return accesstoken", async () => {
      await request(app)
        .post("/users/register")
        .send({ username: "tom", email: "tom@tom.com", password: "password1" });

      const res = await request(app)
        .post("/users/login")
        .send({ username: "tom", password: "password1" });
      expect(res.body).toBeTruthy();
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeTruthy();
    });

    test("should not allow login with wrong password", async () => {
      await request(app)
        .post("/users/register")
        .send({ username: "tom2", password: "correctpassword" });
      const res = await request(app)
        .post("/users/login")
        .send({ username: "tom2", password: "wrongpassword" });
      expect(res.body.message).toBe("username or password incorrect");
    });

    test("should allow user to get own data with valid accessToken", async () => {
      // REGISTER
      await request(app)
        .post("/users/register")
        .send({ username: "tom", email: "tom@tom.com", password: "pass" });
      const loggedInUser = await request(app)
        // LOGIN
        .post("/users/login")
        .send({ username: "tom", password: "pass" });

      // store accessToken
      const accessToken = await loggedInUser._body.accessToken;

      // extract users ID from token
      const id = await decodeToken(accessToken);

      // request own data with own id in params
      const res = await request(app).get(`/users/${id}`).set({ accessToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe("tom");
      expect(res.body.data.email).toBe("tom@tom.tom");
    });

    test("should return not allowed user data if token not valid", async () => {
      // REGISTER
      await request(app)
        .post("/users/register")
        .send({ username: "tom", email: "tom@tom.com", password: "pass" });
      const loggedInUser = await request(app)
        // LOGIN
        .post("/users/login")
        .send({ username: "tom", password: "pass" });

      // store accessToken
      const accessToken = await loggedInUser._body.accessToken;

      // request own data with own id in params
      const res = await request(app)
        .get(`/users/anyidwilldohere`)
        .set({ accessToken: "this is a fake access token" });
      expect(res.statusCode).toBe(500);
      expect(res.body).toStrictEqual({
        success: false,
        message: "not allowed.",
      });
    });

    test("should return ALL users", async () => {
      await request(app)
        .post("/users/register")
        .send({ username: "tom", password: "tom", email: "tom" });
      const user = await request(app)
        .post("/users/login")
        .send({ username: "tom", password: "tom" });
      const accessToken = user._body.accessToken;
      const res = await request(app).get("/users/").set({ accessToken });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Users successfully retrieved");
    });

    test("should return not allowed  for all users", async () => {
      await request(app)
        .post("/users/register")
        .send({ username: "tom", password: "tom", email: "tom" });
      const user = await request(app)
        .post("/users/login")
        .send({ username: "tom", password: "tom" });
      const accessToken = "TAMPERED WITH ACCESS TOKEN";
      const res = await request(app).get("/users/").set({ accessToken });
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("not allowed.");
    });

    test("should return error if no users found", async () => {
      await request(app)
        .post("/users/register")
        .send({ username: "tom", password: "tom", email: "tom" });
      const user = await request(app)
        .post("/users/login")
        .send({ username: "tom", password: "tom" });
      const accessToken = await user._body.accessToken;
      await disconnectDB();
      const res = await request(app).get("/users/").set({ accessToken });
      expect(res.statusCode).toBe(500);
      expect(res.body).toBe("something went wrong.");
    });
  });
});
