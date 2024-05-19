import { FastifyReply, FastifyRequest } from "fastify";

import { IUser } from "../types/User";

import { Logger } from "../config/logger";

import UserModel from "../models/userModel";

async function createAccountNumber(): Promise<number> {
  const timeout = new Promise<number>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Error with account number generator, try again later"));
    }, 3000);
  });

  const generateNumber = async (): Promise<number> => {
    let accountNumber: number;
    let accountNumberExists;

    do {
      accountNumber = Math.floor(Math.random() * 90000) + 10000;
      accountNumberExists = await UserModel.findOne({
        accountNumber,
      }).exec();
    } while (accountNumberExists);

    return accountNumber;
  };

  try {
    const accountNumber: number = await Promise.race([
      generateNumber(),
      timeout,
    ]);
    return accountNumber;
  } catch (error) {
    throw error;
  }
}

const userController = {
  createUser: async (
    req: FastifyRequest<{ Body: IUser }>,
    res: FastifyReply
  ) => {
    const { name, age, cpf, email, password } = req.body;

    if (!name || !age || !cpf || !email || !password) {
      res
        .status(400)
        .send({ message: "One or more required fields are missing" });
      return;
    }

    const accountExistsCpf = await UserModel.findOne({ cpf }).exec();
    const accountExistsEmail = await UserModel.findOne({ email }).exec();

    if (cpf.length != 11) {
      res.status(400).send({ message: "CPF length need be 11" });
      return;
    }
    if (accountExistsCpf) {
      res.status(400).send({
        message: "This CPF is alredy in use, you can't create an account",
      });
      return;
    }
    if (accountExistsEmail) {
      res.status(400).send({
        message: "This email is alredy in use, you can't create an account",
      });
      return;
    }
    if (typeof age != "number") {
      res.status(400).send({ message: "Age need be a number" });
      return;
    }
    if (age < 18) {
      res.status(400).send({ message: "You need be 18 to create an account!" });
      return;
    }

    const accountNumber = await createAccountNumber();

    try {
      await UserModel.create({
        name,
        age,
        cpf,
        email,
        password,
        accountNumber,
        amount: 0,
        pixKeys: [],
      });

      res.status(201).send({ message: "Client created!" });
      Logger.info(`Client ${name} created`);
    } catch (e: any) {
      Logger.error(e.message);
      res.status(500).send({ message: `Unknow error: ${e.message}` });
    }
  },
  deleteUser: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).send({ message: "A valid ID is required on URL" });
      return;
    }

    const user = await UserModel.findOne({ _id: id }).exec();

    if (!user) {
      res.status(400).send({ message: "This user does not exist" });
      return;
    }

    if (user.amount > 0) {
      res.status(400).send({
        message: "You can't exclude an account that has a remaining balance",
      });
      return;
    }

    try {
      await user.deleteOne();

      Logger.info(`User ${user.name} deleted`);
      res.status(201).send({ message: "User deleted" });
    } catch (e: any) {
      Logger.error(e.message);
      res.status(500).send({ message: `Unknow error: ${e.message}` });
    }
  },
};

export default userController;
