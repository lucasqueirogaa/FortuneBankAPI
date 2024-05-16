import api from "./api";
import { Logger } from "./config/logger";

const port = process.env.PORT || 3000;

api.listen(port, () => {
  Logger.info(`A conexão foi estabelecida com sucesso na porta: ${port}`);
});
