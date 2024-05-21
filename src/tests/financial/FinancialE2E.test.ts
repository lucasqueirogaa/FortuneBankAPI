import { test, describe, beforeAll, afterAll } from "vitest";
import request from "supertest";

import { server as app } from "../../api/routes";

import { connectDB, disconnectDB } from "../../config/db";

import UserModel from "../../models/userModel";

describe("Make a deposit Test E2E", () => {
  beforeAll(async () => {
    await connectDB("mongodb://localhost:27017/jestdatabase");
  });

  afterAll(async () => {
    await disconnectDB();
  });

  test("Make a deposit", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Make Deposit",
        cpf: "00000000007",
        age: 18,
        email: "lucasdeposit@gmail.com",
        password: "123456789",
      })
      .expect(201);

    const user = await UserModel.findOne({
      email: "lucasdeposit@gmail.com",
      cpf: "00000000007",
    });

    await request(app.server)
      .put("/deposit")
      .send({
        accountNumber: user?.accountNumber,
        name: "Lucas Queiroga Make Deposit",
        cpf: "00000000007",
        amount: 50,
      })
      .expect(201);
  });
  test("Send missing informations, do not deposit.", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Missing Informations",
        cpf: "00000000008",
        age: 18,
        email: "lucasmissinginformations@gmail.com",
        password: "123456789",
      })
      .expect(201);

    const user = await UserModel.findOne({
      email: "lucasmissinginformations@gmail.com",
      cpf: "00000000008",
    });

    await request(app.server)
      .put("/deposit")
      .send({
        accountNumber: user?.accountNumber,
        name: "",
        cpf: "00000000008",
        amount: "50",
      })
      .expect(400);
  });
  test("Send the amount as a string, do not deposit.", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Amount as String",
        cpf: "00000000009",
        age: 18,
        email: "lucasamountasstring@gmail.com",
        password: "123456789",
      })
      .expect(201);

    const user = await UserModel.findOne({
      email: "lucasamountasstring@gmail.com",
      cpf: "00000000009",
    });

    await request(app.server)
      .put("/deposit")
      .send({
        accountNumber: user?.accountNumber,
        name: "Lucas Queiroga Amount as String",
        cpf: "00000000009",
        amount: "50",
      })
      .expect(400);
  });
  test("Send amount negative, do not deposit.", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Negative Amount",
        cpf: "00000000010",
        age: 18,
        email: "lucasnegativeamount@gmail.com",
        password: "123456789",
      })
      .expect(201);

    const user = await UserModel.findOne({
      email: "lucasnegativeamount@gmail.com",
      cpf: "00000000010",
    });

    await request(app.server)
      .put("/deposit")
      .send({
        accountNumber: user?.accountNumber,
        name: "Lucas Queiroga Negative Amount",
        cpf: "00000000010",
        amount: -50,
      })
      .expect(400);
  });
  test("Send invalid account number, do not deposit.", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Invalid Account Number",
        cpf: "00000000011",
        age: 18,
        email: "lucasinvalidaccnumber@gmail.com",
        password: "123456789",
      })
      .expect(201);

    const user = await UserModel.findOne({
      email: "lucasinvalidaccnumber@gmail.com",
      cpf: "00000000011",
    });

    await request(app.server)
      .put("/deposit")
      .send({
        accountNumber: user!.accountNumber + 1,
        name: "Lucas Queiroga Amount as String",
        cpf: "00000000011",
        amount: 1,
      })
      .expect(400);
  });
});

describe("Make a withdraw Test E2E", () => {
  beforeAll(async () => {
    await connectDB("mongodb://localhost:27017/withdrawdatabase");

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Make Withdraw",
        cpf: "00000000012",
        age: 18,
        email: "lucaswithdraw@gmail.com",
        password: "123456789",
      })
      .expect(201);

    const user = await UserModel.findOne({
      email: "lucaswithdraw@gmail.com",
      cpf: "00000000012",
    });

    await request(app.server)
      .put("/deposit")
      .send({
        accountNumber: user?.accountNumber,
        name: "Lucas Queiroga Make Withdraw",
        cpf: "00000000012",
        amount: 60,
      })
      .expect(201);
  });

  afterAll(async () => {
    await disconnectDB();
  });

  test("Send a withdraw that exceeds the current amount, do not withdraw", async () => {
    await app.ready();

    const user = await UserModel.findOne({
      email: "lucaswithdraw@gmail.com",
      cpf: "00000000012",
    });

    await request(app.server)
      .put("/withdraw")
      .send({
        accountNumber: user?.accountNumber,
        name: "Lucas Queiroga Make Withdraw",
        cpf: "00000000012",
        withdrawValue: 100,
        password: "123456789",
      })
      .expect(400);
  });
  test("Send missing informations, do not withdraw", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Missing informations",
        cpf: "00000000013",
        age: 18,
        email: "lucasmissinginformations@gmail.com",
        password: "123456789",
      })
      .expect(201);

    const user = await UserModel.findOne({
      email: "lucasmissinginformations@gmail.com",
      cpf: "00000000013",
    });

    await request(app.server)
      .put("/withdraw")
      .send({
        accountNumber: user?.accountNumber,
        name: "",
        cpf: "00000000013",
        withdrawValue: 100,
        password: "123456789",
      })
      .expect(400);
  });
  test("Send negative withdraw, do not withdraw", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Negative Withdraw",
        cpf: "00000000014",
        age: 18,
        email: "lucasnegatvewithdraw@gmail.com",
        password: "123456789",
      })
      .expect(201);

    const user = await UserModel.findOne({
      email: "lucasnegatvewithdraw@gmail.com",
      cpf: "00000000014",
    });

    await request(app.server)
      .put("/withdraw")
      .send({
        accountNumber: user?.accountNumber,
        name: "Lucas Queiroga Negative Withdraw",
        cpf: "00000000014",
        withdrawValue: -100,
        password: "123456789",
      })
      .expect(400);
  });
  test("Send acc number like string, do not withdraw", async () => {
    await app.ready();

    await request(app.server)
      .post("/user")
      .send({
        name: "Lucas Queiroga Acc String",
        cpf: "00000000015",
        age: 18,
        email: "lucasaccstring@gmail.com",
        password: "123456789",
      })
      .expect(201);

    await request(app.server)
      .put("/withdraw")
      .send({
        accountNumber: `12345`,
        name: "Lucas Queiroga Acc String",
        cpf: "00000000015",
        withdrawValue: 100,
        password: "123456789",
      })
      .expect(400);
  });
  test("Make a withdraw", async () => {
    const user = await UserModel.findOne({
      email: "lucaswithdraw@gmail.com",
      cpf: "00000000012",
    });

    await request(app.server)
      .put("/withdraw")
      .send({
        accountNumber: user?.accountNumber,
        name: "Lucas Queiroga Make Withdraw",
        cpf: "00000000012",
        withdrawValue: 20,
        password: "123456789",
      })
      .expect(201);
  });
});
