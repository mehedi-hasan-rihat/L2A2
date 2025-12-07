import { Request, Response } from "express";
import { UserService } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await UserService.getUserService();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result?.rows,
        });
    } catch (error: any) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }   

};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if(!userId){
            return  res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const isAdmin = req.user?.role === 'admin';
        
        const userCheck = await UserService.getUserById(parseInt(userId));
        if (!userCheck?.rows[0]) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const isOwnProfile = req.user?.email === userCheck.rows[0].email;

        if (!isAdmin && !isOwnProfile) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const result = await UserService.updateUserService(parseInt(userId), req.body);
        
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {

        if(!req.params.userId){
            return  res.status(400).json({ success: false, message: 'User ID is required' });
        }


        await UserService.deleteUserService(parseInt(req.params.userId));
        res.status(200).json({  
            success: true,
            message: "User deleted successfully"
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }   
};



export const UserController = {
    getUsers,
    updateUser,
    deleteUser
};