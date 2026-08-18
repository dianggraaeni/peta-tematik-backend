"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pertanianController_1 = require("../controllers/pertanianController");
const router = (0, express_1.Router)();
router.get("/aggregate", pertanianController_1.getAggregate);
router.get("/usahasayuran", pertanianController_1.getUsahaSayuran);
exports.default = router;
