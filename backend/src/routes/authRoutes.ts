import { Router } from "express";
import { loginOwner } from "../controllers/authController";

const router = Router();

router.post("/login", loginOwner);

export default router;