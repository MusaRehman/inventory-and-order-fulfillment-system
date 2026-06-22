import { Router } from "express";
import {
  createOrder,
} from "../controllers/orders.js";

let router = Router();

router.post("/create", createOrder);

export default router;
