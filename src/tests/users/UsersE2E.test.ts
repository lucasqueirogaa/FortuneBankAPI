import { test, describe, beforeAll, afterAll } from "vitest";
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
        cpf: "12345678910",
        age: 18,
        email: "lucas@gmail.com",
        password: "13452131212",
      })
      .expect(201);
  });

  test("User should't be create with same CPF", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga",
        cpf: "12345678910",
        age: 18,
        email: "lucas1@gmail.com",
        password: "13452131212",
      })
      .expect(400);
  });

  test("User should't be create with same email", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga",
        cpf: "12345678911",
        age: 18,
        email: "lucas@gmail.com",
        password: "13452131212",
      })
      .expect(400);
  });

  test("User should't be create with age under 18", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga",
        cpf: "12345678914",
        age: 17,
        email: "lucas2@gmail.com",
        password: "13452131212",
      })
      .expect(400);
  });

  test("User should't be create with missing informations", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "",
        cpf: "12345678914",
        age: 17,
        email: "lucas2@gmail.com",
        password: "13452131212",
      })
      .expect(400);
  });
});
