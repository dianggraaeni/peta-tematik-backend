import { Router } from "express";
import { getUmkmData, uploadUmkmData } from "../controllers/umkmController";

const router = Router();

router.get("/", getUmkmData);
router.post("/", uploadUmkmData);

export default router;
