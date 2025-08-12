import express from "express";
import { addUser, getAllUsers, logOutUser, logUser, refreshAuth } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/register", addUser);
router.post("/login", logUser);
router.post("/refresh-token", refreshAuth)
router.post("/logout", logOutUser)
// router.get("/user/:id", getUser);
// router.put("/user/:id", updateUser);

export default router;