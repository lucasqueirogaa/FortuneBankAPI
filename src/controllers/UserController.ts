import { FastifyReply, FastifyRequest } from "fastify";

import { IUser } from "../types/User";

import { Logger } from "../config/logger";

import UserModel from "../models/userModel";

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
    if (typeof age != "number") {
      res.status(400).send({ message: "Age need be a number" });
      return;
    }

    try {
      await UserModel.create({
        name,
        age,
        cpf,
        email,
        password,
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
