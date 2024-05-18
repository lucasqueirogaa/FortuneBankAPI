import { FastifyReply, FastifyRequest } from "fastify";

import { IUser } from "../types/User";

import { Logger } from "../config/logger";

import UserModel from "../models/userModel";

const userController = {
  createAccountNumber: async (): Promise<number> => {
    const timeout = new Promise<number>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error("Error with account number generator, try again later")
        );
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
  },
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

    const accountExistsCpf = await UserModel.findOne({ cpf: cpf }).exec();
    const accountExistsEmail = await UserModel.findOne({ email: email }).exec();

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

    const accountNumber = await userController.createAccountNumber();

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
      res.status(500).send({ message: `Error: ${e.message}` });
    }
  },
};

export default userController;
