import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";

import UserModel from "../models/userModel";

import { Logger } from "../config/logger";

import { IDepositBody, IWithdrawBody } from "../types/Financial";

const financialController = {
  deposit: async (
    req: FastifyRequest<{ Body: IDepositBody }>,
    res: FastifyReply
  ) => {
    const { accountNumber, name, cpf, amount } = req.body;

    if (!name || !accountNumber || !cpf || !amount) {
      res
        .status(400)
        .send({ message: "One or more required fields are missing" });
      return;
    }

    if (typeof amount != "number") {
      res.status(400).send({ message: "Amount type need be number" });
      return;
    }
    if (typeof accountNumber != "number") {
      res.status(400).send({ message: "Account number type need be number" });
      return;
    }

    if (amount <= 0) {
      res.status(400).send({ message: "The amount must be greater than 0" });
      return;
    }

    const user = await UserModel.findOne({ accountNumber, name, cpf }).exec();

    if (!user) {
      res.status(400).send({ message: "This account don't exists" });
      return;
    }

    try {
      user
        .updateOne({
          amount: amount + user.amount,
        })
        .exec();

      Logger.info("Deposit successfully made");
      res.status(201).send({ message: "Deposit successfully made" });
    } catch (e: any) {
      Logger.error(e.message);
      res.status(500).send({ message: `Unknow error: ${e.message}` });
    }
  },
  withdraw: async (
    req: FastifyRequest<{ Body: IWithdrawBody }>,
    res: FastifyReply
  ) => {
    const { accountNumber, withdrawValue, cpf, name, password } = req.body;

    if (!accountNumber || !withdrawValue || !cpf || !name || !password) {
      res
        .status(400)
        .send({ message: "One or more required fields are missing" });
      return;
    }
    if (typeof withdrawValue != "number") {
      res.status(400).send({ message: "Amount type need be number" });
      return;
    }
    if (typeof accountNumber != "number") {
      res.status(400).send({ message: "Account number type need be number" });
      return;
    }
    if (withdrawValue <= 0) {
      res.status(400).send({ message: "The amount must be greater than 0" });
      return;
    }

    const user = await UserModel.findOne({ accountNumber, name, cpf }).exec();

    if (!user) {
      res.status(400).send({ message: "This account don't exists" });
      return;
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      res.status(400).send({ message: "Password incorrect" });
      return;
    }

    if (withdrawValue > user.amount) {
      res.status(400).send({
        message: `You can't withdraw more than you have`,
        currentAmount: user.amount,
      });
      return;
    }

    try {
      user
        .updateOne({
          amount: user.amount - withdrawValue,
        })
        .exec();

      Logger.info("Withdraw successfully made");
      res.status(201).send({ message: "Withdraw successfully made" });
    } catch (e: any) {
      Logger.error(e.message);
      res.status(500).send({ message: `Unknow error: ${e.message}` });
    }
  },
};

export default financialController;
