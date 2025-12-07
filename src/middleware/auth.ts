// higher order function  return korbe function k

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

interface DecodedToken extends JwtPayload {
    name: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

// roles = ["admin", "user"]
const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: No token provided",
                });
            }

            const token = authHeader.split(" ")[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Token missing",
                });
            }

            if (!config.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined");
            }

            const decoded = jwt.verify(token, config.JWT_SECRET) as DecodedToken;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Insufficient permissions",
                });
            }

            req.user = decoded;
            next();

        } catch (err: any) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token",
            });
        }
    };
};

export default auth;
