import { Router } from "express";
import auth from "../../middleware/auth";
import { UserController } from "./user.conroller";

const userRoutes = Router();

// Define user-related routes here
userRoutes.get("/", auth("admin"),  UserController.getUsers);
userRoutes.put("/:userId", auth("admin", "customer"), UserController.updateUser);
userRoutes.delete("/:userId", auth("admin"), UserController.deleteUser);

export default userRoutes;