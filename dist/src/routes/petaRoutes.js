"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const petaController_1 = require("../controllers/petaController");
const router = (0, express_1.Router)();
router.get("/", petaController_1.getPetaData);
exports.default = router;
