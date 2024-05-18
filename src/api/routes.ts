import fastify, { FastifyReply, FastifyRequest } from "fastify";

import { Logger } from "../config/logger";
import userController from "../controllers/UserController";
import { IUser } from "../types/User";

const server = fastify({});

// Basic route for api test
server.get("/", async (req: FastifyRequest, res: FastifyReply) => {
  Logger.info("Base route called");

  return res.code(200).send("API working");
});

server.post(
  "/user",
  (req: FastifyRequest<{ Body: IUser }>, res: FastifyReply) => {
    userController.createUser(req, res);
  }
);

export { server };
