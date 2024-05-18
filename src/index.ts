import "dotenv/config";

import { Logger } from "./config/logger";
import { connectDB } from "./config/db";

import { server } from "./api/routes";

const dbUri = process.env.DB_URI || "";
const port = Number(process.env.PORT) || 4000;
const ADDRESS = process.env.ADDRESS || "localhost";

connectDB(dbUri);
try {
  server.listen({ host: ADDRESS, port: port });
  Logger.info(`Connected with on port ${port}`);
} catch (e: any) {
  Logger.error(`Error with fastify: ${e}`);
  process.exit(1);
}
