import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const signin = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.signin(req.body);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }


};

export const AuthController = {
    signup,
    signin,
};
