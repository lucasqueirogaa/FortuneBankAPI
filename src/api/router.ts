import { Request, Response, Router } from "express";
import { Logger } from "../config/logger";

const router = Router();

// Check status router
router.get("/", (req: Request, res: Response) => {
  Logger.info("Retorno da rota no server corretamente");

  return res.json("Tudo funcionando perfeitamente");
});

export default router;
