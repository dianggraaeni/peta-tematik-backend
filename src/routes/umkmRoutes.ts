import { Router } from "express";
import { getUmkmData } from "../controllers/umkmController";

const router = Router();

router.get("/", getUmkmData);

export default router;
