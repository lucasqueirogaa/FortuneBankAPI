import 'dotenv/config'
import Fastify from "fastify";
import { Logger } from "./config/logger";
import { connectDB } from './config/db';

const dbUri = process.env.DB_URI || "";
const port = Number(process.env.PORT) || 3000;


const server = Fastify({});

server.get("/", async (request, reply) => {
  Logger.info("Base route called");
  
  return reply.code(200).send("API working");
});

connectDB(dbUri);
try {
  server.listen({ port });
  Logger.info(`Connected with on port ${port}`);
} catch (e: any) {
  Logger.error(`Error with fastify: ${e}`);
}
