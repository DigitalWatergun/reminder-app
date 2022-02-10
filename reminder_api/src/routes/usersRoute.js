import express from "express";
import {
    getAllUsers,
    addUser,
    loginUser,
    changeUserPassword,
    logoutUser,
    verifyUserToken,
    refreshUserToken
} from "../controllers/userController.js"

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", addUser);
router.post("/login", loginUser);
router.post("/update", changeUserPassword)
router.post("/logout", logoutUser);
router.post("/verify", verifyUserToken);
router.post("/refresh", refreshUserToken)

export { router as usersRoute };