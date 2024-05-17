import { Request, Response, Router } from "express";
import { Logger } from "../config/logger";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  Logger.info("Rota chamada com sucesso! 1");

  return res.json("Tudo funcionando perfeitamente 1");
});

export default router;
