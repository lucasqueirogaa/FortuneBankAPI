import fastify, { FastifyReply, FastifyRequest } from "fastify";

import { Logger } from "../config/logger";

import { IUser } from "../types/User";
import { IDepositBody, IWithdrawBody } from "../types/Financial";

import userController from "../controllers/UserController";
import financialController from "../controllers/FinancialController";

const server = fastify({});

// Basic route for api test
server.get("/", async (req: FastifyRequest, res: FastifyReply) => {
  Logger.info("Base route called");

  return res.code(200).send("API working");
});

// User endpoints
server.post(
  "/user",
  (req: FastifyRequest<{ Body: IUser }>, res: FastifyReply) => {
    userController.createUser(req, res);
  }
);
server.delete(
  "/user/:id",
  (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
    userController.deleteUser(req, res);
  }
);

// User financial endpoints
server.put(
  "/deposit",
  (req: FastifyRequest<{ Body: IDepositBody }>, res: FastifyReply) => {
    financialController.deposit(req, res);
  }
);
server.put(
  "/withdraw",
  (req: FastifyRequest<{ Body: IWithdrawBody }>, res: FastifyReply) => {
    financialController.withdraw(req, res);
  }
);

export { server };
