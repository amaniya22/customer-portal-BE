import express from "express";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", getAllUsers);
// router.post("/register", addUser);
// router.post("/login", logUser);
// router.get("/user/:id", getUser);
// router.put("/user/:id", updateUser);

export default router;