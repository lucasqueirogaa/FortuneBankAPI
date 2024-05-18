import { test, expect, describe, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { server as app } from "../../api/routes";
import { connectDB, disconnectDB } from "../../config/db";

describe("User E2E", () => {
  beforeAll(async () => {
    await connectDB("mongodb://localhost:27017/jestdatabase");
  });

  afterAll(async () => {
    await disconnectDB();
  });

  test("User should be created", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga",
        cpf: "12341293131",
        age: 18,
        email: "lucas2@gmail.com",
        password: "13452131212",
      })
      .expect(201);
  });
});
