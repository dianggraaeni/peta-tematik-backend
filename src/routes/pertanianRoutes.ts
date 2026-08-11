import { Router } from "express";
import { getAggregate, getUsahaSayuran } from "../controllers/pertanianController";

const router = Router();

router.get("/aggregate", getAggregate);
router.get("/usahasayuran", getUsahaSayuran);

export default router;

