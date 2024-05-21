import { test, describe, beforeAll, afterAll } from "vitest";
import request from "supertest";

import { server as app } from "../../api/routes";

import { connectDB, disconnectDB } from "../../config/db";

import UserModel from "../../models/userModel";

describe("Create User Test E2E", () => {
  beforeAll(async () => {
    await connectDB("mongodb://localhost:27017/createuserdatabase");
  });

  afterAll(async () => {
    await disconnectDB();
  });

  test("Create a user", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Base Test",
        cpf: "00000000001",
        age: 18,
        email: "lucasbasetest@gmail.com",
        password: "123456789",
      })
      .expect(201);
  });

  test("Send same CPF, do not create", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga CPF Test 1",
        cpf: "00000000002",
        age: 18,
        email: "lucascpftest1@gmail.com",
        password: "123456789",
      })
      .expect(201);

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga CPF Test 2",
        cpf: "00000000002",
        age: 18,
        email: "lucascpftest2@gmail.com",
        password: "123456789",
      })
      .expect(400);
  });

  test("Send same email, do not create", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Email Test 1",
        cpf: "00000000004",
        age: 18,
        email: "lucasemailtest@gmail.com",
        password: "123456789",
      })
      .expect(201);

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Email Test 2",
        cpf: "10398547216",
        age: 18,
        email: "lucasemailtest@gmail.com",
        password: "123456789",
      })
      .expect(400);
  });

  test("Send user under 18 years, do not create", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga",
        cpf: "00000000005",
        age: 17,
        email: "lucasageunder18@gmail.com",
        password: "123456789",
      })
      .expect(400);
  });

  test("Send missing informations, do not create", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "",
        cpf: "00000000006",
        age: 18,
        email: "lucasmissinginfos@gmail.com",
        password: "123456789",
      })
      .expect(400);
  });
});

describe("Delete User Test E2E", () => {
  beforeAll(async () => {
    await connectDB("mongodb://localhost:27017/deleteuserdatabase");
  });

  afterAll(async () => {
    await disconnectDB();
  });

  test("User should be deleted", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Delete",
        cpf: "00000000006",
        age: 18,
        email: "lucasdelete@gmail.com",
        password: "123456789",
      })
      .expect(201);

    const user = await UserModel.findOne({ email: "lucasdelete@gmail.com" });

    await request(app.server).delete(`/user/${user?._id}`).expect(201);
  });

  test("User don't exists, don't delete", async () => {
    await app.ready();

    await request(app.server)
      .delete(`/user/00480e74be658dd4758f2f28`)
      .expect(400);
  });

  test("ID not sent, do not delete", async () => {
    await app.ready();

    await request(app.server).delete(`/user/`).expect(400);
  });
});

describe("Update User Test E2E", () => {
  beforeAll(async () => {
    await connectDB("mongodb://localhost:27017/updateuserdatabase");

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Update User",
        cpf: "00000000014",
        age: 18,
        email: "lucasupdateuser@gmail.com",
        password: "123456789",
      })
      .expect(201);

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Update User 2",
        cpf: "00000000015",
        age: 18,
        email: "lucasupdateuser2@gmail.com",
        password: "123456789",
      })
      .expect(201);
  });

  afterAll(async () => {
    await disconnectDB();
  });

  test("Update User", async () => {
    await app.ready();

    const user = await UserModel.findOne({
      cpf: "00000000014",
    });

    await request(app.server)
      .put(`/user/${user?.id}`)
      .send({
        name: "Lucas Queiroga atualizado",
        age: user?.age,
        email: user?.email,
        password: "123456789",
        cpf: user?.cpf,
      })
      .expect(200);
  });
  test("Send missing informations, do not update User", async () => {
    await app.ready();

    const user = await UserModel.findOne({
      cpf: "00000000014",
    });

    await request(app.server)
      .put(`/user/${user?.id}`)
      .send({
        name: "",
        age: user?.age,
        email: user?.email,
        password: "123456789",
        cpf: user?.cpf,
      })
      .expect(400);
  });
  test("Send a existing cpf, do not update User", async () => {
    await app.ready();

    const user = await UserModel.findOne({
      cpf: "00000000014",
    });

    await request(app.server)
      .put(`/user/${user?.id}`)
      .send({
        name: "Lucas Queiroga 2",
        age: user?.age,
        email: user?.email,
        password: "123456789",
        cpf: "00000000015",
      })
      .expect(400);
  });
  test("Send wrong password, do not update User", async () => {
    await app.ready();

    const user = await UserModel.findOne({
      cpf: "00000000014",
    });

    await request(app.server)
      .put(`/user/${user?.id}`)
      .send({
        name: "Lucas Queiroga 2",
        age: user?.age,
        email: user?.email,
        password: "123456780",
        cpf: user?.cpf,
      })
      .expect(400);
  });
});
