import api from "./api";
import { connectDB } from "./config/db";
import { Logger } from "./config/logger";

const dbUri = process.env.DB_URI || "";
const port = process.env.PORT || 3000;

connectDB(dbUri);

api.listen(port, () => {
  Logger.info(`A conexão foi estabelecida com sucesso na porta: ${port}`);
});
