"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createAdmin = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../config/prisma"));
const JWT_SECRET = process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required.",
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { username },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password.",
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password.",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            username: user.username,
            role: user.role,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
exports.login = login;
const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required.",
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long.",
            });
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username already exists.",
            });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const newUser = await prisma_1.default.user.create({
            data: {
                name: username,
                username,
                email: `${username}@bps.go.id`,
                password: hashedPassword,
                role: "admin",
            },
        });
        res.status(201).json({
            success: true,
            message: "Admin account created successfully!",
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.error("Create admin error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
exports.createAdmin = createAdmin;
const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No Authorization header provided. Please include 'Authorization: Bearer <token>' in your request headers.",
                howToGetToken: "First login at POST /api/auth/login to get a token",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid Authorization header format. Use 'Bearer <token>'",
                receivedHeader: authHeader,
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token - user not found.",
            });
        }
        res.json({
            success: true,
            message: "Token is valid",
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
            tokenInfo: {
                issuedAt: new Date(decoded.iat * 1000),
                expiresAt: new Date(decoded.exp * 1000),
            },
        });
    }
    catch (error) {
        console.error("Token verification error:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again.",
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token format.",
            });
        }
        res.status(401).json({
            success: false,
            message: "Token verification failed.",
        });
    }
};
exports.verifyToken = verifyToken;
