"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const umkmController_1 = require("../controllers/umkmController");
const router = (0, express_1.Router)();
router.get("/", umkmController_1.getUmkmData);
exports.default = router;
