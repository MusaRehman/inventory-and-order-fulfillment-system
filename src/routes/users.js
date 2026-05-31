import { Router } from "express";
import {
  createUser,
} from "../controllers/users.js";

let router = Router();

router.post("/create", createUser);

export default router;
