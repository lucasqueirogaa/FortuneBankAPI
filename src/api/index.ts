import "dotenv/config";
import express from "express";
import cors from "cors";

import router from "./router";

const api = express();

api.use(express.json());
api.use(cors());

api.use(router);

export default api;
